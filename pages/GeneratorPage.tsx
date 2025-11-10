import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateImages, editImage } from '../services/geminiService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { IMAGE_GENERATION_COST, CONTACT_EMAIL, ESEWA_NUMBER, APP_NAME } from '../constants';
import { useAdmin } from '../hooks/useAdmin';
import { GeneratedImage } from '../types';
import StarIcon from '../components/icons/StarIcon';
import Loader from '../components/common/Loader';
import SparklesIcon from '../components/icons/SparklesIcon';
import DownloadIcon from '../components/icons/DownloadIcon';

declare const lucide: any;

type GeneratorMode = 'text-to-image' | 'image-editor';
type WatermarkPosition = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const GeneratorPage: React.FC = () => {
  const { user, deductCredits, addCredits } = useAuth();
  const { requests } = useAdmin();
  
  const [mode, setMode] = useState<GeneratorMode>('text-to-image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageType, setUploadedImageType] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(2);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  const totalCost = mode === 'image-editor' ? IMAGE_GENERATION_COST : IMAGE_GENERATION_COST * numberOfImages;
  const hasPurchasedPlan = requests.some(req => req.userEmail === user?.email && req.status === 'Approved');
  
  useEffect(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, [isLoading, generatedImages, hasPurchasedPlan, mode]);

  const promptTemplates = {
    "Portrait": "Close-up portrait of a warrior princess, intricate silver armor, piercing blue eyes, flowing white hair, fantasy, sharp focus, cinematic lighting, hyper-detailed, art by Greg Rutkowski and Alphonse Mucha.",
    "Landscape": "Breathtaking fantasy landscape, floating islands with waterfalls, giant luminous trees, vibrant alien flora, serene atmosphere, epic scale, digital painting, matte painting, concept art.",
    "Sci-Fi": "A sleek, futuristic starship bridge, holographic displays showing star charts, astronauts in modern suits, view of a swirling nebula through the main viewport, clean design, cinematic, 8k, unreal engine.",
    "Fantasy": "A majestic dragon with iridescent scales perched atop a craggy mountain peak, roaring at a stormy sky, lightning flashes revealing its immense size, epic fantasy, D&D, detailed, oil painting.",
  };

  const handleSetTemplate = (template: string) => {
    setPrompt(promptTemplates[template]);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setUploadedImageType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    let finalPrompt = prompt;
    if (negativePrompt.trim()) {
        finalPrompt = `${prompt} --no ${negativePrompt}`;
    }

    if (!finalPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    if (mode === 'image-editor' && !uploadedImage) {
        setError('Please upload an image to edit.');
        return;
    }

    if (!user || user.credits < totalCost) {
      setIsModalOpen(true);
      return;
    }

    if (!deductCredits(totalCost)) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
        if (mode === 'text-to-image') {
            const base64Images = await generateImages(finalPrompt, numberOfImages);
            const newImages: GeneratedImage[] = base64Images.map((img, index) => ({
                id: `${Date.now()}-${index}`,
                src: `data:image/png;base64,${img}`,
                rating: 0
            }));
            setGeneratedImages(newImages);
        } else { // Image Editor mode
            const base64Data = uploadedImage!.split(',')[1];
            const editedBase64 = await editImage(finalPrompt, base64Data, uploadedImageType!);
            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                src: `data:image/png;base64,${editedBase64}`,
                rating: 0
            };
            setGeneratedImages([newImage]);
        }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      addCredits(totalCost); // Refund credits on failure
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, user, deductCredits, addCredits, numberOfImages, totalCost, mode, uploadedImage, uploadedImageType]);
  
  const downloadWithWatermark = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.max(24, Math.min(canvas.width * 0.05, 48));
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        
        const margin = fontSize;
        let x, y;

        switch (watermarkPosition) {
            case 'top-left': ctx.textAlign = 'left'; ctx.textBaseline = 'top'; x = margin; y = margin; break;
            case 'top-center': ctx.textAlign = 'center'; ctx.textBaseline = 'top'; x = canvas.width / 2; y = margin; break;
            case 'top-right': ctx.textAlign = 'right'; ctx.textBaseline = 'top'; x = canvas.width - margin; y = margin; break;
            case 'center': ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; x = canvas.width / 2; y = canvas.height / 2; break;
            case 'bottom-left': ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; x = margin; y = canvas.height - margin; break;
            case 'bottom-center': ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; x = canvas.width / 2; y = canvas.height - margin; break;
            case 'bottom-right': ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; x = canvas.width - margin; y = canvas.height - margin; break;
            default: ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; x = canvas.width - margin; y = canvas.height - margin;
        }

        ctx.strokeText(APP_NAME, x, y);
        ctx.fillText(APP_NAME, x, y);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `rgai-watermarked-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
  };

  const downloadOriginal = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `rgai-final-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRating = (imageId: string, rating: number) => {
    setGeneratedImages(prev => prev.map(img => img.id === imageId ? { ...img, rating } : img));
  };

  const stylePresetBtnStyles = "text-xs px-2.5 py-1.5 w-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";
  const watermarkPositionBtnStyles = (pos: WatermarkPosition) => `w-6 h-6 rounded flex items-center justify-center transition-colors ${watermarkPosition === pos ? 'bg-brandFrom text-white' : 'bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700'}`;

  const getWatermarkPositionClass = () => {
    switch (watermarkPosition) {
        case 'top-left': return 'watermark-top-left';
        case 'top-center': return 'watermark-top-center';
        case 'top-right': return 'watermark-top-right';
        case 'center': return 'watermark-center';
        case 'bottom-left': return 'watermark-bottom-left';
        case 'bottom-center': return 'watermark-bottom-center';
        case 'bottom-right': return 'watermark-bottom-right';
        default: return 'watermark-bottom-right';
    }
  }


  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-[420px] flex-shrink-0">
        <div className="glass-card p-6 rounded-xl shadow-lg sticky top-24">
            
            <div className="mb-6 p-1 bg-gray-200 dark:bg-gray-700/50 rounded-lg grid grid-cols-2 gap-1">
                <button onClick={() => setMode('text-to-image')} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'text-to-image' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Text to Image</button>
                <button onClick={() => setMode('image-editor')} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'image-editor' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Image Editor</button>
            </div>

          <h1 className="text-2xl font-bold mb-1 font-display text-gray-900 dark:text-white">Compose your Idea</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Use templates, style presets, or type freely.</p>
          <div className="space-y-6">
            
            {mode === 'image-editor' && (
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Image</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300/50 dark:border-gray-600/50 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {uploadedImage ? (
                                <img src={uploadedImage} alt="Uploaded preview" className="mx-auto h-24 w-auto rounded-lg" />
                            ) : (
                                <i data-lucide="image-up" className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                             <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-brandFrom dark:text-brandTo hover:text-brandFrom/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brandFrom">
                                    <span>{uploadedImage ? 'Change file' : 'Upload a file'}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>
            )}
            
            {mode === 'text-to-image' && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt Templates</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(promptTemplates).map(template => (
                        <button key={template} onClick={() => handleSetTemplate(template)} className={stylePresetBtnStyles}>
                            {template}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Prompt
              </label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm"
                placeholder="A hyper-detailed portrait of an astronaut on Mars, cinematic golden hour lighting..."
              />
            </div>

            <div>
              <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Negative Prompt (optional)
              </label>
              <input
                id="negative-prompt"
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm"
                placeholder="e.g. no text, no watermark, blurry"
              />
            </div>

             <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPrompt(p => `${p}, photorealistic, 8k, ultra-detailed`)} className={stylePresetBtnStyles}>Photorealistic</button>
                    <button onClick={() => setPrompt(p => `${p}, artistic, oil painting`)} className={stylePresetBtnStyles}>Artistic</button>
                    <button onClick={() => setPrompt(p => `${p}, vector art, flat colors`)} className={stylePresetBtnStyles}>Vector</button>
                    <button onClick={() => setPrompt(p => `${p}, cyberpunk, neon lights`)} className={stylePresetBtnStyles}>Cyberpunk</button>
                </div>
            </div>

            {mode === 'text-to-image' && (
                <div>
                    <label htmlFor="image-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number of Images: <span className="font-bold text-brandFrom dark:text-brandTo">{numberOfImages}</span>
                    </label>
                    <input
                        id="image-count"
                        type="range"
                        min="1"
                        max="4"
                        value={numberOfImages}
                        onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2 accent-brandFrom"
                    />
                </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Watermark Position</h4>
              <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg grid grid-cols-3 gap-2">
                <button onClick={() => setWatermarkPosition('top-left')} className={watermarkPositionBtnStyles('top-left')}><i data-lucide="move-up-left" className="w-4 h-4" /></button>
                <button onClick={() => setWatermarkPosition('top-center')} className={watermarkPositionBtnStyles('top-center')}><i data-lucide="move-up" className="w-4 h-4" /></button>
                <button onClick={() => setWatermarkPosition('top-right')} className={watermarkPositionBtnStyles('top-right')}><i data-lucide="move-up-right" className="w-4 h-4" /></button>
                <button onClick={() => setWatermarkPosition('bottom-left')} className={watermarkPositionBtnStyles('bottom-left')}><i data-lucide="move-down-left" className="w-4 h-4" /></button>
                <button onClick={() => setWatermarkPosition('bottom-center')} className={watermarkPositionBtnStyles('bottom-center')}><i data-lucide="move-down" className="w-4 h-4" /></button>
                <button onClick={() => setWatermarkPosition('bottom-right')} className={watermarkPositionBtnStyles('bottom-right')}><i data-lucide="move-down-right" className="w-4 h-4" /></button>
              </div>
            </div>


            <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading} className="w-full !py-3 !text-base !font-bold">
              <SparklesIcon className="w-5 h-5 mr-2" />
              {mode === 'image-editor' ? 'Edit Image' : 'Generate'} ({totalCost} credits)
            </Button>
            {error && <p className="text-accent1 text-sm mt-2 text-center">{error}</p>}
          </div>
        </div>
      </div>

      {/* Right Panel: Image Display */}
      <div className="w-full lg:flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {isLoading && Array.from({ length: mode === 'image-editor' ? 1 : numberOfImages }).map((_, i) => (
                <div key={i} className="relative aspect-square glass-card rounded-xl shadow-lg flex items-center justify-center p-4">
                    <div className="text-center">
                        <Loader />
                    </div>
                </div>
            ))}

            {!isLoading && generatedImages.length === 0 && (
                <div className="sm:col-span-2 relative aspect-square glass-card rounded-xl shadow-lg flex items-center justify-center p-4">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <i data-lucide="image-play" className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                        <p className="font-semibold font-display">Your generated images will appear here.</p>
                        <p className="text-sm">Let your creativity flow!</p>
                    </div>
                </div>
            )}
            
            {!isLoading && generatedImages.map((image) => (
                <div key={image.id} className="relative group aspect-square rounded-xl overflow-hidden shadow-lg glass-card">
                    <img src={image.src} alt={prompt} className="w-full h-full object-cover"/>
                    <div className={`absolute text-white/50 text-xs font-bold pointer-events-none p-2 ${getWatermarkPositionClass()}`}>{APP_NAME}</div>
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                           <button onClick={() => downloadWithWatermark(image.src)} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center gap-1.5 text-xs">
                                <DownloadIcon className="w-4 h-4" /> Watermark
                            </button>
                            {hasPurchasedPlan ? (
                                <button onClick={() => downloadOriginal(image.src)} className="p-2 bg-brandFrom rounded-full text-white hover:bg-brandFrom/80 transition-colors backdrop-blur-sm flex items-center gap-1.5 text-xs">
                                    <i data-lucide="gem" className="w-4 h-4"/> No Watermark
                                </button>
                            ) : (
                               <div className="relative group/tooltip">
                                     <span className="p-2 bg-white/20 rounded-full text-white cursor-not-allowed">
                                        <i data-lucide="lock" className="w-5 h-5"/>
                                     </span>
                                     <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                                        Purchase a plan to download without watermark.
                                     </div>
                               </div>
                            )}
                        </div>
                        {/* Rating */}
                        <div className="flex justify-center items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => handleRating(image.id, star)}>
                                    <StarIcon className={`w-7 h-7 transition-colors drop-shadow-lg ${image.rating >= star ? 'text-accent2' : 'text-white/40 hover:text-white/70'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Insufficient Credits"
      >
        <p className="text-gray-600 dark:text-gray-300">
            You don't have enough credits to generate images. Please purchase a plan to continue creating.
        </p>
        <div className="mt-6 text-left p-4 bg-brandFrom/10 rounded-lg border border-brandFrom/20">
           <h4 className="font-semibold text-gray-800 dark:text-gray-200">Contact us to purchase:</h4>
           <p className="mt-2">
            <span className="font-medium">Email:</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="ml-2 font-semibold text-brandFrom dark:text-brandTo hover:underline">{CONTACT_EMAIL}</a>
           </p>
           <p className="mt-1">
            <span className="font-medium">eSewa:</span>
            <span className="ml-2 font-semibold text-brandFrom dark:text-brandTo">{ESEWA_NUMBER}</span>
           </p>
        </div>
      </Modal>
    </div>
  );
};

export default GeneratorPage;