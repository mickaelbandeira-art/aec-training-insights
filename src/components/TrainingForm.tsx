import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { saveResponse } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Send, Clock, MapPin, FileText, Home, Briefcase, MessageSquare, User, Phone } from 'lucide-react';
import logo from '@/assets/logo-aec.png';

const formOptions = [
  { id: 'disponibilidadeHorario', label: 'Você possui disponibilidade de horário compatível com a vaga?', icon: Clock },
  { id: 'localidadeTreinamento', label: 'A localização do treinamento é acessível para você?', icon: MapPin },
  { id: 'pendenciasDocumento', label: 'Você possui algum documento pendente que possa impedir sua participação?', icon: FileText },
  { id: 'ausenciaHomeOffice', label: 'A impossibilidade de atuar em home office impacta sua decisão?', icon: Home },
  { id: 'outraOportunidadeEmprego', label: 'Você recebeu ou está participando de outra oportunidade de emprego?', icon: Briefcase },
  { id: 'periodoTreinamentoLongo', label: 'O tempo de treinamento, sem remuneração, é um fator que dificulta sua participação?', icon: Clock },
  { id: 'afinidadeProduto', label: 'Você sente que não tem afinidade com o produto ou serviço da operação?', icon: Briefcase },
  { id: 'residenciaOutraCidade', label: 'Morar em outra cidade impede sua presença no treinamento presencial?', icon: MapPin },
];

export function TrainingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    disponibilidadeHorario: false,
    localidadeTreinamento: false,
    pendenciasDocumento: false,
    ausenciaHomeOffice: false,
    outraOportunidadeEmprego: false,
    periodoTreinamentoLongo: false,
    afinidadeProduto: false,
    residenciaOutraCidade: false,
    outros: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.nome.trim() || !formData.telefone.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e telefone.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    saveResponse(formData);

    toast({
      title: "Formulário enviado com sucesso!",
      description: "Obrigado pela sua participação.",
    });

    // Reset form
    setFormData({
      nome: '',
      telefone: '',
      disponibilidadeHorario: false,
      localidadeTreinamento: false,
      pendenciasDocumento: false,
      ausenciaHomeOffice: false,
      outraOportunidadeEmprego: false,
      periodoTreinamentoLongo: false,
      afinidadeProduto: false,
      residenciaOutraCidade: false,
      outros: '',
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <img
            src={logo}
            alt="AeC Logo"
            className="h-8 sm:h-10 object-contain animate-fade-in cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          />
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="text-sm border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
          >
            Área Admin
          </Button>
        </header>

        {/* Main Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="gradient-primary text-primary-foreground rounded-t-lg pb-8">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Forms Treinamento AeC
              </CardTitle>
            </div>
            <CardDescription className="text-primary-foreground/80 text-base">
              Por favor, selecione os motivos que se aplicam à sua situação
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Phone Fields */}
              <div className="space-y-4 pb-4 border-b border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-secondary" />
                    <Label htmlFor="nome" className="text-base font-medium">
                      Nome Completo <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="border-2 focus:border-secondary focus:ring-secondary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-secondary" />
                    <Label htmlFor="telefone" className="text-base font-medium">
                      Telefone <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className="border-2 focus:border-secondary focus:ring-secondary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-4">
                {formOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-secondary hover:bg-muted/50 transition-all duration-300 group animate-slide-in"
                      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors flex-shrink-0" />
                        <Label
                          htmlFor={option.id}
                          className="text-base font-medium cursor-pointer group-hover:text-foreground transition-colors"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <Checkbox
                        id={option.id}
                        checked={formData[option.id as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                        className="h-5 w-5 border-2 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary flex-shrink-0 ml-4"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Outros - Text Input */}
              <div
                className="space-y-3 animate-slide-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  <Label htmlFor="outros" className="text-base font-medium">
                    Outros
                  </Label>
                </div>
                <Textarea
                  id="outros"
                  placeholder="Descreva outros motivos aqui..."
                  value={formData.outros}
                  onChange={(e) => setFormData(prev => ({ ...prev, outros: e.target.value }))}
                  className="min-h-[120px] resize-none border-2 focus:border-secondary focus:ring-secondary/20 transition-all"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold gradient-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Enviar Formulário
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p>Desenvolvido por Mickael Bandeira | Analista de Conteúdo</p>
        </footer>
      </div>
    </div>
  );
}
