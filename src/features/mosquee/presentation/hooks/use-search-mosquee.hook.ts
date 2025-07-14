import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { useEffect, useState } from "react";
import { SearchMosqueeItem } from "../../application/search-mosquee.usecase";
import { searchMosquee, searchMosqueeAction } from "../redux/mosquee.action";

const pageSize = 10; // Define a constant for the number of results per page
export function useSearchMosquee() {
    // This hook can be used to manage the state and logic for searching mosques.
    // For example, it could handle input changes, API calls, and results filtering.

    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useAppDispatch();
    const foundMosquees = useAppSelector((state) => state.mosquee.foundMosquees);

    const isLoading = useAppSelector((state) => state.status[searchMosqueeAction]?.status === 'loading');
    const isError = useAppSelector((state) => state.status[searchMosqueeAction]?.status === 'error');
    const isSuccess = useAppSelector((state) => state.status[searchMosqueeAction]?.status === 'success');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    const { location } = useGeolocation();

    const [mosquees, setMosquees] = useState<SearchMosqueeItem[]>([]);

    useEffect(() => {
        if ((isError || isSuccess) && isRefreshing) {
            if (isSuccess) {
                setMosquees(foundMosquees.items);
            }
            setIsRefreshing(false);
        }

        if (isSuccess && !isRefreshing) {
            setMosquees((prevMosquees) => [
                ...prevMosquees,
                ...foundMosquees.items,
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isSuccess])

    function search(params: { name: string, page: number, pageSize: number }) {
        dispatch(searchMosquee({
            ...params,
            location: location ? {
                latitude: location.coords.latitude || 0,
                longitude: location.coords.longitude || 0,
            } : undefined
        }));
    }

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
        search({ name: text, page: 1, pageSize });
        setPage(1); // Reset the page to 1 when search term changes
    };

    function loadMore() {
        setPage(page + 1);
        search({
            name: searchTerm,
            page: page + 1,
            pageSize: pageSize,
        });
    }

    function refresh() {
        setPage(1);
        search({
            name: searchTerm,
            page: 1,
            pageSize: pageSize,
        });
        setIsRefreshing(true);
    }

    return {
        searchTerm,
        handleSearchChange,
        mosquees: mosquees,
        loadMore,
        refresh,
        isLoading,
        isRefreshing,
    };
}