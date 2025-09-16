import { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from 'date-fns';

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(" ");
  const navigate = useNavigate()
  const { history, clearHistory, addHistory } = useSearchHistory()


  const { data: location, isLoading } = useLocationSearch(query);
  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    addHistory.mutate({
      query,
      name: "",
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    })
    navigate(`/city/${name}??lat=${lat}&lon=${lon} `);
    setOpen(false);

  };

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        {" "}
        <Search className="mr-2 h-4 w-4" /> Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length && !isLoading && (
            <CommandEmpty>No cities found.</CommandEmpty>
          )}
          <CommandGroup heading="Favorites">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup >
                <p>Recent Searches</p>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => clearHistory.mutate()}>
                  <XCircle className="w-4 h-4 " />
                  Clear</Button>
                  {history.map((city) =>{
                  return(
                    <CommandItem
                    key={`${city.lat}-${city.lon}`}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                    >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{city.name}</span>
                  {city.state && (
                    <span className="text-sm text-muted-foreground">
                      , {city.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {city.country}
                  </span>
                  <span>{format(city.searchedAt, "MM d, H:mm a")}</span>
                </CommandItem>

                  ) 
                  })}
{/* <CommandItem>Calendar</CommandItem> */}
              </CommandGroup>
              <CommandSeparator />

            </>
          )}
          
          {location && location.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {location?.map((city) => (
                <CommandItem
                  key={`${city.lat}-${city.lon}`}
                  value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{city.name}</span>
                  {city.state && (
                    <span className="text-sm text-muted-foreground">
                      , {city.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {city.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
