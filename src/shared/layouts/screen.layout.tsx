import { Box } from "@/components/ui/box";

interface ScreenLayoutProps {
    children: React.ReactNode;
}

export function ScreenLayout(props: ScreenLayoutProps) {
    return (
        <Box className="flex-1 bg-slate-100">
            <Box className="flex-1 pt-16">{props.children}</Box>
        </Box>
    );
}