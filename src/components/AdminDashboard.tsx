import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStatistics, getResponses, clearResponses, type FormResponse } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowLeft, Users, Clock, MapPin, FileText, Home, Briefcase, 
  MessageSquare, Trash2, RefreshCw, TrendingUp 
} from 'lucide-react';
import logo from '@/assets/logo-aec.png';

const CHART_COLORS = ['#003366', '#00BCD4', '#0077B6', '#48CAE4', '#90E0EF', '#CAF0F8'];

const categoryLabels: Record<string, string> = {
  disponibilidadeHorario: 'Disponibilidade de Horário',
  localidadeTreinamento: 'Localidade do Treinamento',
  pendenciasDocumento: 'Pendências de documento',
  ausenciaHomeOffice: 'Ausência de home office',
  outraOportunidadeEmprego: 'Outra oportunidade de emprego',
  outros: 'Outros',
};

const categoryIcons: Record<string, React.ElementType> = {
  disponibilidadeHorario: Clock,
  localidadeTreinamento: MapPin,
  pendenciasDocumento: FileText,
  ausenciaHomeOffice: Home,
  outraOportunidadeEmprego: Briefcase,
  outros: MessageSquare,
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getStatistics());
  const [responses, setResponses] = useState<FormResponse[]>(getResponses());

  const refreshData = () => {
    setStats(getStatistics());
    setResponses(getResponses());
    toast({
      title: "Dados atualizados",
      description: "Os dados foram atualizados com sucesso.",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      clearResponses();
      refreshData();
      toast({
        title: "Dados limpos",
        description: "Todos os dados foram removidos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStatistics());
      setResponses(getResponses());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const barChartData = [
    { name: 'Disp. Horário', value: stats.disponibilidadeHorario.count, fullName: categoryLabels.disponibilidadeHorario },
    { name: 'Localidade', value: stats.localidadeTreinamento.count, fullName: categoryLabels.localidadeTreinamento },
    { name: 'Pendências', value: stats.pendenciasDocumento.count, fullName: categoryLabels.pendenciasDocumento },
    { name: 'Home Office', value: stats.ausenciaHomeOffice.count, fullName: categoryLabels.ausenciaHomeOffice },
    { name: 'Outra Oport.', value: stats.outraOportunidadeEmprego.count, fullName: categoryLabels.outraOportunidadeEmprego },
    { name: 'Outros', value: stats.outros.count, fullName: categoryLabels.outros },
  ];

  const pieChartData = barChartData.filter(item => item.value > 0);

  const statCards = [
    { key: 'disponibilidadeHorario', ...stats.disponibilidadeHorario },
    { key: 'localidadeTreinamento', ...stats.localidadeTreinamento },
    { key: 'pendenciasDocumento', ...stats.pendenciasDocumento },
    { key: 'ausenciaHomeOffice', ...stats.ausenciaHomeOffice },
    { key: 'outraOportunidadeEmprego', ...stats.outraOportunidadeEmprego },
    { key: 'outros', count: stats.outros.count, percentage: stats.outros.percentage },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-4 px-4 sm:px-6 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={logo} alt="AeC Logo" className="h-10 object-contain brightness-0 invert" />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearData}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Dados
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground">
            Visualize os resultados do formulário de treinamento
          </p>
        </div>

        {/* Total Responses Card */}
        <Card className="mb-8 border-0 shadow-lg gradient-accent text-accent-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-accent-foreground/20 rounded-full">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Total de Respostas</p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <div className="ml-auto">
                <TrendingUp className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = categoryIcons[stat.key];
            return (
              <Card 
                key={stat.key} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium mb-1">
                        {categoryLabels[stat.key]}
                      </p>
                      <p className="text-3xl font-bold text-foreground">{stat.count}</p>
                      <p className="text-secondary text-sm font-semibold">
                        {stat.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
              <CardDescription>Quantidade de respostas por motivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {stats.total > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#666', fontSize: 11 }}
                        axisLine={{ stroke: '#ccc' }}
                      />
                      <YAxis 
                        tick={{ fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card p-3 rounded-lg shadow-lg border">
                                <p className="font-semibold text-foreground">{payload[0].payload.fullName}</p>
                                <p className="text-secondary font-bold">{payload[0].value} respostas</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(187, 100%, 42%)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Proporção de Respostas</CardTitle>
              <CardDescription>Visualização em porcentagem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card p-3 rounded-lg shadow-lg border">
                                <p className="font-semibold text-foreground">{payload[0].payload.fullName}</p>
                                <p className="text-secondary font-bold">{payload[0].value} respostas</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outros Comments Section */}
        {stats.outros.entries.length > 0 && (
          <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                Comentários "Outros"
              </CardTitle>
              <CardDescription>
                {stats.outros.entries.length} comentário(s) registrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {stats.outros.entries.map((entry, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-muted rounded-lg border-l-4 border-secondary"
                  >
                    <p className="text-foreground">{entry}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Responses Table */}
        {responses.length > 0 && (
          <Card className="mt-8 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Últimas Respostas</CardTitle>
              <CardDescription>Histórico das respostas recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Data/Hora</th>
                      <th className="text-center p-3 font-semibold">Disp. Horário</th>
                      <th className="text-center p-3 font-semibold">Localidade</th>
                      <th className="text-center p-3 font-semibold">Pendências</th>
                      <th className="text-center p-3 font-semibold">Home Office</th>
                      <th className="text-center p-3 font-semibold">Outra Oport.</th>
                      <th className="text-left p-3 font-semibold">Outros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.slice().reverse().slice(0, 10).map((response) => (
                      <tr key={response.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground">
                          {new Date(response.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td className="p-3 text-center">
                          {response.disponibilidadeHorario && (
                            <span className="inline-block w-4 h-4 bg-secondary rounded-full" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {response.localidadeTreinamento && (
                            <span className="inline-block w-4 h-4 bg-secondary rounded-full" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {response.pendenciasDocumento && (
                            <span className="inline-block w-4 h-4 bg-secondary rounded-full" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {response.ausenciaHomeOffice && (
                            <span className="inline-block w-4 h-4 bg-secondary rounded-full" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {response.outraOportunidadeEmprego && (
                            <span className="inline-block w-4 h-4 bg-secondary rounded-full" />
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                          {response.outros || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
