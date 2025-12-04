import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveResponse, PillarSelection } from '@/lib/storage';
import { pillars, Pillar } from '@/data/pillarData';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Send, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo-aec.png';

export function TrainingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    outros: '',
  });
  const [selectedPillar, setSelectedPillar] = useState<string>('');
  const [selectedSubPillar, setSelectedSubPillar] = useState<string>('');
  const [allSelections, setAllSelections] = useState<PillarSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPillar = pillars.find(p => p.id === selectedPillar);

  const handleAddSelections = () => {
    if (!selectedPillar || !selectedSubPillar) {
      toast({
        variant: "destructive",
        title: "Seleção incompleta",
        description: "Por favor, selecione um pilar e um subpilar.",
      });
      return;
    }

    const pillar = pillars.find(p => p.id === selectedPillar);
    if (!pillar) return;

    const subPillar = pillar.subPillars.find(sp => sp.id === selectedSubPillar);
    if (!subPillar) return;

    const newSelection: PillarSelection = {
      pillarId: pillar.id,
      pillarLabel: pillar.label,
      subPillarId: subPillar.id,
      subPillarLabel: subPillar.label,
    };

    setAllSelections([...allSelections, newSelection]);
    setSelectedPillar('');
    setSelectedSubPillar('');

    toast({
      title: "Seleção adicionada!",
      description: "Motivo adicionado com sucesso.",
    });
  };

  const handleRemoveSelection = (index: number) => {
    setAllSelections(allSelections.filter((_, i) => i !== index));
  };

  const handleSubPillarToggle = (subPillarId: string) => {
    setSelectedSubPillar(prev =>
      prev === subPillarId ? '' : subPillarId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.nome.trim() || !formData.telefone.trim() || !formData.cpf.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, CPF e telefone.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    saveResponse({
      nome: formData.nome,
      cpf: formData.cpf,
      telefone: formData.telefone,
      selections: allSelections,
      outros: formData.outros,
    });

    toast({
      title: "Formulário enviado com sucesso!",
      description: "Obrigado pela sua participação.",
    });

    // Reset form
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      outros: '',
    });
    setAllSelections([]);
    setSelectedPillar('');
    setSelectedSubPillar('');

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
        <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="gradient-primary text-primary-foreground rounded-t-lg pb-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-2 justify-center">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Registro de Motivos de Desistência de Treinamento
              </CardTitle>
            </div>
            <CardDescription className="text-primary-foreground/80 text-base text-center ml-12">
              Identificação dos fatores que levaram o candidato a não concluir o processo de capacitação
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Phone Fields */}
              <div className="space-y-4 pb-4 border-b border-border">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-base font-medium">
                    Nome Completo <span className="text-destructive">*</span>
                  </Label>
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
                  <Label htmlFor="cpf" className="text-base font-medium">
                    CPF <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 11) value = value.slice(0, 11);
                      value = value.replace(/(\d{3})(\d)/, '$1.$2');
                      value = value.replace(/(\d{3})(\d)/, '$1.$2');
                      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                      setFormData(prev => ({ ...prev, cpf: value }));
                    }}
                    className="border-2 focus:border-secondary focus:ring-secondary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-base font-medium">
                    Telefone <span className="text-destructive">*</span>
                  </Label>
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

              {/* Pillar Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Selecione o motivo principal (Pilar)
                  </Label>
                  <Select value={selectedPillar} onValueChange={setSelectedPillar}>
                    <SelectTrigger className="border-2 focus:border-secondary focus:ring-secondary/20">
                      <SelectValue placeholder="Escolha um pilar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pillars.map(pillar => (
                        <SelectItem key={pillar.id} value={pillar.id}>
                          {pillar.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-Pillar Selection */}
                {currentPillar && (
                  <div className="space-y-3 animate-fade-in">
                    <Label className="text-base font-medium">
                      Selecione o motivo específico
                    </Label>
                    <div className="space-y-2 p-4 rounded-lg border-2 border-secondary/20 bg-muted/30">
                      {currentPillar.subPillars.map(subPillar => (
                        <div
                          key={subPillar.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-secondary hover:bg-muted/50 transition-all duration-300"
                        >
                          <Label
                            htmlFor={subPillar.id}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {subPillar.label}
                          </Label>
                          <Checkbox
                            id={subPillar.id}
                            checked={selectedSubPillar === subPillar.id}
                            onCheckedChange={() => handleSubPillarToggle(subPillar.id)}
                            className="h-5 w-5 border-2 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary ml-4"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddSelections}
                      className="w-full gradient-accent hover:opacity-90 transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Seleção
                    </Button>
                  </div>
                )}
              </div>

              {/* Selected Items Display */}
              {allSelections.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Motivos selecionados ({allSelections.length})
                  </Label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-lg border-2 border-secondary/20 bg-muted/30">
                    {allSelections.map((selection, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                      >
                        <span className="font-semibold">{selection.pillarLabel}:</span>
                        <span>{selection.subPillarLabel}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelection(index)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Outros - Text Input */}
              <div className="space-y-3">
                <Label htmlFor="outros" className="text-base font-medium">
                  Outros motivos (opcional)
                </Label>
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
