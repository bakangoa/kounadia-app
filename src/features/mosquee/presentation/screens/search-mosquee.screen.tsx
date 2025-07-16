import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useConstants } from "@/src/shared/hooks/use-contants.hook";
import { ScreenLayout } from "@/src/shared/layouts/screen.layout";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MosqueeCard } from "../components/mosquee-card.component";
import { useSearchMosquee } from "../hooks/use-search-mosquee.hook";



export function SearchMosqueeScreen() {
    const { t } = useTranslation("home");
    const { APP_NAME } = useConstants();
    const { mosquees, searchTerm, handleSearchChange, loadMore, refresh, isRefreshing } = useSearchMosquee();

    useEffect(() => {
        refresh(); // Refresh the mosquees when the component mounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ScreenLayout>
            <VStack className="flex-1 pt-4 gap-4">
                <VStack className="px-6 gap-2">
                    <Heading className="text-2xl">{t('welcome', { appName: APP_NAME })}</Heading>
                    <Input>
                        <InputField
                            className="bg-white rounded-lg border border-slate-300"
                            placeholder={t("search_placeholder")}
                            value={searchTerm}
                            onChangeText={handleSearchChange}
                        />
                    </Input>
                </VStack>
                <Box className="grow">
                    <FlashList
                        data={mosquees}
                        renderItem={({ item }) => <MosqueeCard {...item} />}
                        onRefresh={refresh}
                        refreshing={isRefreshing}
                        estimatedItemSize={100}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ItemSeparatorComponent={() => <Box className="h-4" />}
                    />
                </Box>
            </VStack>
        </ScreenLayout>
    );
}