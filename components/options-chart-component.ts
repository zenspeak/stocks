import React, { FC, use, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getOptionsData } from "@/lib/get-options-data";

interface OptionsChartProps {
  symbol: string;
}

interface OptionData {
  strikePrice: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
}

const chartConfig = {
  lastPrice: {
    label: "Last Price",
    color: "hsl(var(--chart-1))",
  },
  bid: {
    label: "Bid",
    color: "hsl(var(--chart-2))",
  },
  ask: {
    label: "Ask",
    color: "hsl(var(--chart-3))",
  },
};

export const OptionsChart: FC<OptionsChartProps> = ({ symbol }) => {
  const [expirationDate, setExpirationDate] = useState("");
  const [optionsData, setOptionsData] = useState<OptionData[]>([]);

  const handleSearch = async () => {
    const data = await getOptionsData(symbol, expirationDate);
    setOptionsData(data);
  };

  const formattedData = useMemo(() => {
    return optionsData.map((item) => ({
      ...item,
      strikePrice: Number(item.strikePrice.toFixed(2)),
    }));
  }, [optionsData]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{symbol} Options</CardTitle>
        <div className="flex space-x-2">
          <Input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="Expiration Date"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="strikePrice"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`$${value}`, chartConfig[name as keyof typeof chartConfig].label]}
                labelFormatter={(label) => `Strike Price: $${label}`}
              />
              {Object.entries(chartConfig).map(([key, config]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config.color}
                  name={key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Showing options data for {symbol} expiring on {expirationDate}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};
