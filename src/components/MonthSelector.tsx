import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MonthSelectorProps {
    selectedMonth: number | null;
    selectedYear: number;
    onMonthChange: (month: number | null) => void;
    onYearChange: (year: number) => void;
    availableYears: number[];
}

const MONTHS = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

export function MonthSelector({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    availableYears,
}: MonthSelectorProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>Filtrar por período:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => onYearChange(parseInt(value))}
                >
                    <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedMonth?.toString() || 'all'}
                    onValueChange={(value) =>
                        onMonthChange(value === 'all' ? null : parseInt(value))
                    }
                >
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Todos os meses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os meses</SelectItem>
                        {MONTHS.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedMonth !== null && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMonthChange(null)}
                        className="w-full sm:w-auto"
                    >
                        Limpar filtro
                    </Button>
                )}
            </div>
        </div>
    );
}
