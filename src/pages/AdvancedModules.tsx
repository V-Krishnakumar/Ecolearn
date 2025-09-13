import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Thermometer, TreePine, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdvancedModules() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const advancedModules = [
    {
      id: "environmental-policy",
      title: t('advanced.environmental.title'),
      description: t('advanced.environmental.description'),
      icon: FileText,
      duration: `20 ${t('advanced.common.seconds')}`,
      difficulty: t('advanced.common.advanced'),
      route: "/lesson/environmental-policy",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800"
    },
    {
      id: "climate-change",
      title: t('advanced.climate.title'),
      description: t('advanced.climate.description'),
      icon: Thermometer,
      duration: `20 ${t('advanced.common.seconds')}`,
      difficulty: t('advanced.common.advanced'),
      route: "/lesson/climate-change",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800"
    },
    {
      id: "biodiversity",
      title: t('advanced.biodiversity.title'),
      description: t('advanced.biodiversity.description'),
      icon: TreePine,
      duration: `20 ${t('advanced.common.seconds')}`,
      difficulty: t('advanced.common.advanced'),
      route: "/lesson/biodiversity",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">{t('advanced.modules.title')}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('advanced.modules.subtitle')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {advancedModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card key={module.id} className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {module.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {module.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(module.route)}
                    className={`w-full ${module.bgColor} ${module.textColor} hover:opacity-90`}
                  >
                    {t('advanced.common.start.learning')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-center">{t('advanced.modules.features.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('advanced.modules.features.depth.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('advanced.modules.features.depth.desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('advanced.modules.features.interactive.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('advanced.modules.features.interactive.desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('advanced.modules.features.realworld.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('advanced.modules.features.realworld.desc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('advanced.modules.prerequisites.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('advanced.modules.prerequisites.desc')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{t('advanced.modules.prerequisites.basic')}</Badge>
              <Badge variant="outline">{t('advanced.modules.prerequisites.sustainability')}</Badge>
              <Badge variant="outline">{t('advanced.modules.prerequisites.ecosystem')}</Badge>
              <Badge variant="outline">{t('advanced.modules.prerequisites.challenges')}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            {t('advanced.common.back.dashboard')}
          </Button>
        </div>
      </main>
    </div>
  );
}
