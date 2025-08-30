import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { useEffect, useState } from "react";
import { SearchMosqueItem } from "../../application/search-mosque.usecase";
import { searchMosque, searchMosqueAction } from "../redux/mosque.action";

const pageSize = 30; // Define a constant for the number of results per page
export function useSearchMosque() {
    // This hook can be used to manage the state and logic for searching mosques.
    // For example, it could handle input changes, API calls, and results filtering.

    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useAppDispatch();
    const foundMosques = useAppSelector((state) => state.mosque.foundMosques);

    const isLoading = useAppSelector((state) => state.status[searchMosqueAction]?.status === 'loading');
    const isError = useAppSelector((state) => state.status[searchMosqueAction]?.status === 'error');
    const isSuccess = useAppSelector((state) => state.status[searchMosqueAction]?.status === 'success');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);

    const { location } = useGeolocation();

    const [mosques, setMosques] = useState<SearchMosqueItem[]>([]);

    useEffect(() => {
        if ((isError || isSuccess) && isRefreshing) {
            if (isSuccess) {
                setMosques(foundMosques.items);
            }
            setIsRefreshing(false);
        }

        if (isSuccess && !isRefreshing) {
            setMosques((prevMosques) => [
                ...prevMosques,
                ...foundMosques.items,
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isSuccess])

    function search(params: { name: string, page: number, pageSize: number }) {
        dispatch(searchMosque({
            ...params,
            location: location ? {
                latitude: location.coords.latitude || 0,
                longitude: location.coords.longitude || 0,
            } : undefined
        }));
        console.log("Searching for mosques with params:", params);
    }

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
        search({ name: text, page: 1, pageSize });
        setPage(1); // Reset the page to 1 when search term changes
    };

    function loadMore() {
        console.info("loadMore", page);
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
        mosques: mosques,
        loadMore,
        refresh,
        isLoading,
        isRefreshing,
    };
}