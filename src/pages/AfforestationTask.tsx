import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TreePine, 
  Upload, 
  Camera, 
  CheckCircle, 
  ArrowLeft, 
  Image as ImageIcon,
  X,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function AfforestationTask() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: t('upload.error.title'),
        description: t('upload.error.invalid.file'),
        variant: "destructive",
      });
      return;
    }

    if (imageFiles.length > 5) {
      toast({
        title: t('upload.error.title'),
        description: t('upload.error.too.many.files'),
        variant: "destructive",
      });
      return;
    }

    setUploadedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setIsUploading(false);
    setTaskCompleted(true);
    
    toast({
      title: t('upload.success.title'),
      description: t('upload.success.description'),
    });
  };

  const handleSubmit = () => {
    if (uploadedImages.length === 0) {
      toast({
        title: t('upload.error.title'),
        description: t('upload.error.no.files'),
        variant: "destructive",
      });
      return;
    }

    simulateUpload();
  };

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/realtime-tasks')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('task.back.to.tasks')}
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-nature rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('task.afforestation.title')}
              </h1>
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                {t('task.status.active')}
              </Badge>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground">
            {t('task.afforestation.description')}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Task Instructions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>{t('task.instructions.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-sm text-muted-foreground">{t('task.afforestation.step1')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-sm text-muted-foreground">{t('task.afforestation.step2')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-sm text-muted-foreground">{t('task.afforestation.step3')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-sm text-muted-foreground">{t('task.afforestation.step4')}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('task.location')}: {t('task.location.anywhere')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t('task.duration')}: {t('task.duration.15.30.min')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t('task.participants')}: 1,250+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <span>{t('upload.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!taskCompleted ? (
                <>
                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('upload.drag.drop')}</h3>
                    <p className="text-muted-foreground mb-4">{t('upload.or.click')}</p>
                    <Button variant="outline">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {t('upload.select.files')}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">{t('upload.selected.files')} ({uploadedImages.length})</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getImagePreview(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('upload.progress')}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={uploadedImages.length === 0 || isUploading}
                    className="w-full bg-gradient-nature hover:opacity-90"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        {t('upload.uploading')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('upload.submit.task')}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                /* Completion Screen */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t('task.completed.title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('task.completed.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigate('/realtime-tasks')}
                      variant="outline"
                    >
                      {t('task.back.to.tasks')}
                    </Button>
                    <Button
                      onClick={() => navigate('/scoreboard')}
                      className="bg-gradient-nature hover:opacity-90"
                    >
                      {t('task.view.achievements')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
