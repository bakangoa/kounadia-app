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
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OtpInput } from "react-native-otp-entry";
// eslint-disable-next-line import/no-named-as-default
import z from "zod";
import { useLogin } from "../hooks/use-login.hook";

const loginSchema = z.object({
    phone: z.string().min(10, "form.phone.error.required").regex(/^\d+$/, "form.phone.error.regex"),
})

export function LoginScreen() {
    const { t } = useTranslation("login");
    const { navigateToRegister } = useNavigate();
    const { tryLogin, login, isSuccess } = useLogin();
    const [hasTriedLogin, setHasTriedLogin] = useState(false);
    const [otp, setOtp] = useState("");
    const method = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        if (isSuccess && !hasTriedLogin) {
            setHasTriedLogin(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    function onSubmit(data: z.infer<typeof loginSchema>) {
        tryLogin(data.phone);
    }

    function handleLogin() {
        if (!otp || otp.length < 4) {
            return
        }
        login(otp);
    }

    function handleBack() {
        setHasTriedLogin(false);
    }

    return (
        <ScreenLayout>
            <VStack className="flex-1 pt-4 gap-4">
                <Box className={`px-6 gap-2`}>
                    <Heading className="text-xl font-semibold">
                        {
                            t("title")
                        }
                    </Heading>
                </Box>
                <Box className={`grow relative bg-white pt-12`}>
                    <FormProvider {...method}>
                        <VStack className="gap-8 px-4">
                            {
                                !hasTriedLogin ? (
                                    <>
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
                                                    <Input className="my-1 rounded-lg">
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
                                        <Button onPress={method.handleSubmit(onSubmit)} className="w-full bg-brand-500 rounded-lg h-12">
                                            <ButtonText>
                                                {t("login-button")}
                                            </ButtonText>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <OtpInput
                                            numberOfDigits={4}
                                            type="numeric"
                                            onTextChange={setOtp}
                                        />
                                        <Button onPress={handleLogin} className="w-full bg-brand-500 rounded-lg h-12">
                                            <ButtonText>
                                                {t("login-button")}
                                            </ButtonText>
                                        </Button>
                                        <Button onPress={handleBack} className="w-full rounded-lg h-12">
                                            <ButtonText>
                                                {t("back")}
                                            </ButtonText>
                                        </Button>
                                    </>
                                )
                            }
                            <HStack className="items-center justify-center gap-2">
                                <Text>
                                    {t("to-register-label")}
                                </Text>
                                <Button variant="link" onPress={navigateToRegister}>
                                    <ButtonText className="text-brand-500">
                                        {t("register")}
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