import { DetailScreen } from "@/src/features/mosque/presentation/screens/detail.screen";
import { useLocalSearchParams } from "expo-router";


export default function MosqueDetail() {
    const { id } = useLocalSearchParams();

    return (
        <DetailScreen id={id as string} />
    )
}