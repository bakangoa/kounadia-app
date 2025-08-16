import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { MosqueInfoForm, mosqueInfoSchema } from "../components/mosque-info-form.component";
import { MosqueOpeningHourForm } from "../components/mosque-opening-hour-form.component";

function Stepper(props: {
    currentStep: number;
    totalSteps: number;
}) {
    return (
        <HStack className="w-full gap-2">
            {
                Array.from({ length: props.totalSteps }, (_, index) => (
                    <Box
                        key={index}
                        className={`${props.totalSteps > 1 ? `w-1/${props.totalSteps}` : "w-full"} h-1 rounded-full ${props.currentStep >= index ? "bg-green-500" : "bg-gray-300"}`}
                    />
                ))
            }
        </HStack>
    );
}

interface Step {
    title: string;
}

const steps: Step[] = [
    {
        title: "form.step1.title",
    },
    {
        title: "form.step2.title",
    }
];

const fullSchema = mosqueInfoSchema.extend({

})

export function AddFormScreen() {
    const { t } = useTranslation("add")
    const [step, setStep] = useState(0);
    const { navigateBack } = useNavigate();

    const methods = useForm({
        resolver: zodResolver(fullSchema),
    });

    const handleSubmit = (data: any) => {
        console.log(data);
    }

    const handleAction = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            methods.handleSubmit(handleSubmit)();
        }
    }
    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            navigateBack();
        }
    }
    return (
        <Box className="flex-1 bg-white">
            <SafeAreaView>
                <VStack className="h-full">
                    <VStack className="gap-2 px-6 pb-2 bg-white">
                        <HStack className="gap-6 items-center">
                            <Button variant="link" onPress={handleBack}>
                                <ButtonIcon as={ChevronLeftIcon} className="w-8 h-8" />
                            </Button>
                            <Heading>
                                {t(steps[step].title)}
                            </Heading>
                        </HStack>
                        <Stepper currentStep={step} totalSteps={steps.length} />
                    </VStack>
                    <Box className="flex-1 px-6 bg-slate-100">
                        <FormProvider {...methods}>
                            {
                                (
                                    () => {
                                        switch (step) {
                                            case 0:
                                                return <MosqueInfoForm onNext={handleAction} />;
                                            case 1:
                                                return <MosqueOpeningHourForm onNext={handleAction} />;
                                        }
                                    }
                                )()
                            }
                        </FormProvider>
                    </Box>
                </VStack>
            </SafeAreaView>
        </Box>
    );
}