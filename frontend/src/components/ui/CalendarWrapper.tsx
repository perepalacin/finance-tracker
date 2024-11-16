import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';
import { Calendar } from './calendar';
import { Button } from './button';

interface CalendarWrapperProps {
    selectedDateRange: DateRange | undefined;
    setSelectedDateRange: (newDateRange: DateRange) => void;
    deleteDateRange: () => void;
}

const CalendarWrapper:React.FC<CalendarWrapperProps> = ({selectedDateRange, setSelectedDateRange, deleteDateRange}) => {
  
    const [dateRange, setDateRange] = useState<DateRange | undefined>(selectedDateRange);

    return (
        <div className='flex flex-col w-full h-full'>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
            />
            <div className='flex flex-row w-full items-center justify-end gap-2 px-4 pb-4'>
                <Button disabled={dateRange?.from === undefined || dateRange?.to === undefined} variant="secondary" onClick={() =>{deleteDateRange(); setDateRange(undefined)}}>
                    Delete Date Range
                </Button>
                <Button disabled={dateRange?.from === undefined || dateRange?.to === undefined} variant="default" onClick={() => {if (dateRange) { setSelectedDateRange(dateRange)}}}>
                    Set Date Range
                </Button>
            </div>
        </div>
    )
}

export default CalendarWrapper
