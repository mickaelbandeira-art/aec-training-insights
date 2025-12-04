import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getResponses, clearResponses, type FormResponse, filterResponsesByMonth, getAvailableYears, getStatisticsForFiltered } from '@/lib/storage';
import { exportToExcel } from '@/lib/exportUtils';
import { MonthSelector } from '@/components/MonthSelector';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  ArrowLeft, Users, MessageSquare, TrendingUp, LogOut, Download, Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo-aec.png';

const CHART_COLORS = ['#003366', '#00BCD4', '#0077B6', '#48CAE4', '#90E0EF', '#CAF0F8'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const allResponses = getResponses();

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>(getAvailableYears(allResponses));

  const filteredResponses = filterResponsesByMonth(allResponses, selectedMonth, selectedYear);
  const [stats, setStats] = useState(getStatisticsForFiltered(filteredResponses));
  const [responses, setResponses] = useState<FormResponse[]>(filteredResponses);

  const refreshData = () => {
    const allData = getResponses();
    const filtered = filterResponsesByMonth(allData, selectedMonth, selectedYear);
    setStats(getStatisticsForFiltered(filtered));
    setResponses(filtered);
    setAvailableYears(getAvailableYears(allData));
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleExportExcel = () => {
    if (responses.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado para exportar",
        description: "Não há respostas para exportar.",
      });
      return;
    }

    try {
      exportToExcel(responses);
      toast({
        title: "Excel exportado com sucesso!",
        description: `${responses.length} resposta(s) exportada(s).`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: "Ocorreu um erro ao gerar o arquivo Excel.",
      });
    }
  };

  useEffect(() => {
    const allData = getResponses();
    const filtered = filterResponsesByMonth(allData, selectedMonth, selectedYear);
    setStats(getStatisticsForFiltered(filtered));
    setResponses(filtered);
    setAvailableYears(getAvailableYears(allData));
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const interval = setInterval(() => {
      const allData = getResponses();
      const filtered = filterResponsesByMonth(allData, selectedMonth, selectedYear);
      setStats(getStatisticsForFiltered(filtered));
      setResponses(filtered);
      setAvailableYears(getAvailableYears(allData));
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear]);

  // Prepare chart data from pillars
  const barChartData = stats.pillars.map(pillar => ({
    name: pillar.pillarLabel,
    value: pillar.count,
    fullName: pillar.pillarLabel
  }));

  const pieChartData = barChartData.filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-3 sm:py-4 px-3 sm:px-6 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <img src={logo} alt="AeC Logo" className="h-8 sm:h-10 object-contain brightness-0 invert" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="border-white/50 bg-white/10 hover:bg-white/20 flex-1 sm:flex-initial text-sm"
              style={{ color: 'white' }}
            >
              <Download className="w-4 h-4 mr-2" />
              <span style={{ color: 'white' }}>Exportar Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/50 bg-white/10 hover:bg-white/20 flex-1 sm:flex-initial text-sm"
              style={{ color: 'white' }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span style={{ color: 'white' }}>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visualize os resultados do formulário de treinamento
          </p>
        </div>

        {/* Month Selector */}
        <div className="mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            availableYears={availableYears}
          />
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

        {/* Stats Grid - Dynamic Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.pillars.map((pillar, index) => (
            <Card
              key={pillar.pillarId}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      {pillar.pillarLabel}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{pillar.count}</p>
                    <p className="text-secondary text-sm font-semibold">
                      {pillar.percentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Layers className="w-6 h-6 text-secondary" />
                  </div>
                </div>

                {/* Sub-pillars breakdown */}
                {pillar.subPillars.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Principais motivos:</p>
                    {pillar.subPillars
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3) // Show top 3 sub-pillars
                      .map(sub => (
                        <div key={sub.subPillarId} className="flex justify-between items-center text-sm">
                          <span className="text-foreground/80 truncate max-w-[180px]" title={sub.subPillarLabel}>
                            {sub.subPillarLabel}
                          </span>
                          <span className="font-medium text-secondary">{sub.count}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Outros Card */}
          <Card
            className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${(stats.pillars.length + 2) * 0.1}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">
                    Outros
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stats.outros.count}</p>
                  <p className="text-secondary text-sm font-semibold">
                    {stats.outros.percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Pilar</CardTitle>
              <CardDescription>Quantidade de respostas por categoria principal</CardDescription>
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
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
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
              <CardTitle className="text-lg">Proporção de Pilares</CardTitle>
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
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-sm min-w-[1000px] sm:min-w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Data/Hora</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Nome</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">CPF</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">Telefone</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden lg:table-cell">Código da Turma</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Motivos Selecionados</th>
                      <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Outros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.slice().reverse().slice(0, 10).map((response) => (
                      <tr key={response.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-2 sm:p-3 text-muted-foreground text-xs sm:text-sm whitespace-nowrap align-top">
                          {new Date(response.timestamp).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-2 sm:p-3 text-foreground text-xs sm:text-sm font-medium align-top">
                          {response.nome || '-'}
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground text-xs sm:text-sm hidden sm:table-cell align-top">
                          {response.cpf || '-'}
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground text-xs sm:text-sm hidden sm:table-cell align-top">
                          {response.telefone || '-'}
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground text-xs sm:text-sm hidden lg:table-cell align-top">
                          {response.codigoTurma || '-'}
                        </td>
                        <td className="p-2 sm:p-3 align-top">
                          <div className="flex flex-wrap gap-1">
                            {response.selections && response.selections.length > 0 ? (
                              response.selections.map((selection, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-background">
                                  <span className="font-semibold mr-1">{selection.pillarLabel}:</span>
                                  {selection.subPillarLabel}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground max-w-[120px] sm:max-w-[200px] truncate text-xs sm:text-sm align-top">
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
