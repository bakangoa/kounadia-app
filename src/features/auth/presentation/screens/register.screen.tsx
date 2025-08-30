import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { ScreenLayout } from "@/src/shared/layouts/screen.layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line import/no-named-as-default
import z from "zod";
import { useRegister } from "../hooks/use-register.hook";

const registerSchema = z.object({
    fullname: z.string().min(6, "form.fullname.error.required"),
    phone: z.string().min(10, "form.phone.error.required").regex(/^\d+$/, "form.phone.error.regex"),
})

export function RegisterScreen() {
    const { t } = useTranslation("register");
    const { navigateToLogin } = useNavigate();
    const { register, isLoading } = useRegister();
    const method = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema)
    });

    function onSubmit(data: z.infer<typeof registerSchema>) {
        register({
            fullname: data.fullname,
            phone: data.phone
        });
    }

    return (
        <ScreenLayout>
            <VStack className="flex-1 pt-4 gap-4">
                <Box className={`px-6 gap-2`}>
                    <Heading className="text-2xl">
                        {
                            t("title")
                        }
                    </Heading>
                </Box>
                <Box className={`grow relative bg-white pt-12`}>
                    <FormProvider {...method}>
                        <VStack className="gap-8 px-4">
                            <Controller
                                control={method.control}
                                name="fullname"
                                render={({ field, fieldState }) => (
                                    <FormControl
                                        isInvalid={fieldState.invalid}
                                        size="md"
                                        isDisabled={field.disabled}
                                        isReadOnly={false}
                                        isRequired={true}
                                    >
                                        <FormControlLabel>
                                            <FormControlLabelText>{t("form.fullname.label")}</FormControlLabelText>
                                        </FormControlLabel>
                                        <Input className="my-1">
                                            <InputField
                                                placeholder={t("form.fullname.placeholder")}
                                                value={field.value}
                                                onChangeText={(text) => field.onChange(text)}
                                            />
                                        </Input>
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircleIcon} />
                                            <FormControlErrorText>
                                                {fieldState.error?.message ? t(fieldState.error.message) : ""}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={method.control}
                                name="phone"
                                render={({ field, fieldState }) => (
                                    <FormControl
                                        isInvalid={fieldState.invalid}
                                        size="md"
                                        isDisabled={field.disabled}
                                        isReadOnly={false}
                                        isRequired={true}
                                    >
                                        <FormControlLabel>
                                            <FormControlLabelText>{t("form.phone.label")}</FormControlLabelText>
                                        </FormControlLabel>
                                        <Input className="my-1">
                                            <InputField
                                                placeholder={t("form.phone.placeholder")}
                                                value={field.value}
                                                keyboardType="phone-pad"
                                                onChangeText={(text) => field.onChange(text)}
                                            />
                                        </Input>
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircleIcon} />
                                            <FormControlErrorText>
                                                {fieldState.error?.message ? t(fieldState.error.message) : ""}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />
                            <Button 
                                onPress={method.handleSubmit(onSubmit)} 
                                className="w-full bg-brand-500 rounded-lg h-12" 
                                isDisabled={isLoading}>
                                <ButtonText>
                                    {t("register-button")}
                                </ButtonText>
                            </Button>
                            <HStack className="items-center justify-center gap-2">
                                <Text>
                                    {t("to-login-label")}
                                </Text>
                                <Button variant="link" onPress={navigateToLogin}>
                                    <ButtonText className="text-brand-500">
                                        {t("login")}
                                    </ButtonText>
                                </Button>
                            </HStack>
                        </VStack>
                    </FormProvider>
                </Box>
            </VStack>
        </ScreenLayout>
    )
}