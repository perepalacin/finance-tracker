import { QueryParamsProps } from '@/types';
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, CalendarIcon } from 'lucide-react'
import { useState } from 'react';
import { assert } from 'console';

interface QueryBuilderProps {
    dataLabel: string;
    queryParams: QueryParamsProps;
    searchFieldOptions: string[];
    sortByOptions: string[];
    updateQueryParams: (newQueryParams: QueryParamsProps) => void;
};

const TableQueryBuilder: React.FC<QueryBuilderProps> = ({dataLabel, queryParams, searchFieldOptions, sortByOptions, updateQueryParams}) => {

    const [queryParamsState, setQueryParamsState] = useState<QueryParamsProps>(queryParams);

    const handleChangeQueryParams = (field: "searchField" | "searchInput" | "dateRange" | "sortByField" | "ascending", data: any) => {
        const newQueryParamsState= {...queryParams};
        switch (field) {
            case "searchField": 
                newQueryParamsState.searchField = data; 
                setQueryParamsState(newQueryParamsState);
                break;
            
            case "searchInput": 
                newQueryParamsState.searchInput = data;
                setQueryParamsState(newQueryParamsState); 
                updateQueryParams(newQueryParamsState);
                break;
            case "dateRange": 
                newQueryParamsState.dateRange = data;
                setQueryParamsState(newQueryParamsState);
                updateQueryParams(newQueryParamsState);
                break;
            case "sortByField": 
                newQueryParamsState.orderBy = data;
                setQueryParamsState(newQueryParamsState);
                updateQueryParams(newQueryParamsState);
                break;
            case "ascending": 
                newQueryParamsState.ascending = data;
                setQueryParamsState(newQueryParamsState);
                updateQueryParams(newQueryParamsState);
                break;
        }
        return;
    }

    return (
    <div className='flex flex-row w-[95%] items-center justify-between gap-2'>
        <div className='flex flex-row items-center justify-start w-1/3 gap-2'>
        <Select defaultValue={searchFieldOptions[0]} value={queryParamsState.searchField} onValueChange={(value) => handleChangeQueryParams("searchField", value)}>
            <SelectTrigger className="w-44">
                <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {searchFieldOptions.map((option) => 
                        <SelectItem value={option} key={option}>{option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}</SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
        <Input
            value={queryParamsState.searchInput}
            onChange={(e) => handleChangeQueryParams("searchInput", e.target.value)}
            placeholder={'Search for ' + dataLabel + ' ' + queryParamsState.searchField} 
        />
        </div>
        <div className='flex flex-row items-center justify-end w-1/2 gap-2'>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "min-w-72 justify-start text-left font-normal",
                !queryParamsState.dateRange && "text-muted-foreground"
                )}
            >
                <CalendarIcon />
                {queryParamsState.dateRange?.from ? (
                queryParamsState.dateRange.to ? (
                    <>
                    {format(queryParamsState.dateRange.from, "LLL dd, y")} -{" "}
                    {format(queryParamsState.dateRange.to, "LLL dd, y")}
                    </>
                ) : (
                    format(queryParamsState.dateRange.from, "LLL dd, y")
                )
                ) : (
                <span>Pick a date range</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={queryParamsState.dateRange?.from}
                selected={queryParamsState.dateRange}
                onSelect={(newDateRange) => handleChangeQueryParams("dateRange", newDateRange) }
                numberOfMonths={2}
            />
            </PopoverContent>
        </Popover>
        <p className='text-nowrap'>Sort by: </p>
        <Select defaultValue={sortByOptions[0]} value={queryParamsState.orderBy} onValueChange={(value) => handleChangeQueryParams("sortByField", value)}>
        <SelectTrigger className="w-72">
            <SelectValue placeholder="Sort by"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {sortByOptions.map((option) => 
                        <SelectItem value={option} key={option}>{option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}</SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
        <Button variant="secondary" className='w-72' onClick={() => handleChangeQueryParams("ascending", !queryParamsState.ascending)}>
            {queryParamsState.ascending ?
            <>
                <ArrowUp />
                Ascending
            </> 
            :
            <>
                <ArrowDown />
                Descending
            </>
            }
        </Button>
        </div>
    </div>
  )
}

export default TableQueryBuilder
