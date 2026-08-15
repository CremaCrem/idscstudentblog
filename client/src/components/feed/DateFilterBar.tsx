import React from 'react';
import { Badge } from '../ui/Badge';

export type DateRangeType = 'All Time' | 'This Week' | 'This Month' | 'This Year';

interface DateFilterBarProps {
    activeRange: DateRangeType;
    onSelectDateRange: (rangeType: DateRangeType, dateFrom: string | null, dateTo: string | null) => void;
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({ activeRange, onSelectDateRange }) => {
    const handleSelect = (rangeType: DateRangeType) => {
        const now = new Date();
        let dateFrom: string | null = null;
        let dateTo: string | null = now.toISOString();

        if (rangeType === 'All Time') {
            dateTo = null;
        } else if (rangeType === 'This Week') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFrom = lastWeek.toISOString();
        } else if (rangeType === 'This Month') {
            const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFrom = lastMonth.toISOString();
        } else if (rangeType === 'This Year') {
            const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            dateFrom = lastYear.toISOString();
        }

        onSelectDateRange(rangeType, dateFrom, dateTo);
    };

    const options: DateRangeType[] = ['All Time', 'This Week', 'This Month', 'This Year'];

    return (
        <div className="flex gap-3 overflow-x-auto scrollbar-none mb-6">
            {options.map((option) => (
                <Badge
                    key={option}
                    className={`cursor-pointer transition-colors ${activeRange === option ? '!bg-zinc-800 !text-white' : 'hover:bg-zinc-200'}`}
                    onClick={() => handleSelect(option)}
                >
                    {option}
                </Badge>
            ))}
        </div>
    );
};
