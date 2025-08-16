
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Maps } from "@/src/shared/components/maps.component";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const MarkerIcon = "https://ngovnpbvytakxpgxrccq.supabase.co/storage/v1/object/public/statics//Pin%202.png";

export const mosqueInfoSchema = z.object({
    name: z.string().min(6, "form.name.error.required"),
    contact: z.string()
        .min(10, "form.contact.error.min")
        .regex(
            /^\d{10}$/,
            "form.contact.error.regex"
        ),
    email: z.email("form.email.error"),
    website: z.string().optional(),
    location: z.object({
        latitude: z.number(),
        longitude: z.number()
    })
});

interface Props {
    onNext: () => void
}

export function MosqueInfoForm(props: Props) {
    const { t } = useTranslation("add");
    const { location: userLocation } = useGeolocation();
    const { trigger, control, getValues, getFieldState } = useFormContext();

    const handleAction = async () => {
        const valid = await trigger(["name", "contact", "email", "website", "location"]);
        console.info("location errors", getFieldState("location"));
        console.info("valid", getValues(), valid);
        if (!valid) {
            return;
        }
        props.onNext();
    }
    return (
        <>
            <Box className="flex-1">
                <VStack className="gap-4">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormControl
                                isInvalid={fieldState.invalid}
                                size="md"
                                isDisabled={field.disabled}
                                isReadOnly={false}
                                isRequired={true}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText>{t("form.name.label")}</FormControlLabelText>
                                </FormControlLabel>
                                <Input className="my-1">
                                    <InputField
                                        placeholder={t("form.name.placeholder")}
                                        value={field.value}
                                        onChangeText={(text) => field.onChange(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        {t("form.name.helper")}
                                    </FormControlHelperText>
                                </FormControlHelper>
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
                        control={control}
                        name="contact"
                        render={({ field, fieldState }) => (
                            <FormControl
                                isInvalid={fieldState.invalid}
                                size="md"
                                isDisabled={field.disabled}
                                isReadOnly={false}
                                isRequired={true}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText>{t("form.contact.label")}</FormControlLabelText>
                                </FormControlLabel>
                                <Input className="my-1">
                                    <InputField
                                        placeholder={t("form.contact.placeholder")}
                                        value={field.value}
                                        onChangeText={(text) => field.onChange(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        {t("form.contact.helper")}
                                    </FormControlHelperText>
                                </FormControlHelper>
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
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormControl
                                isInvalid={fieldState.invalid}
                                size="md"
                                isDisabled={field.disabled}
                                isReadOnly={false}
                                isRequired={true}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText>{t("form.email.label")}</FormControlLabelText>
                                </FormControlLabel>
                                <Input className="my-1">
                                    <InputField
                                        placeholder={t("form.email.placeholder")}
                                        value={field.value}
                                        onChangeText={(text) => field.onChange(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        {t("form.email.helper")}
                                    </FormControlHelperText>
                                </FormControlHelper>
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
                        control={control}
                        name="website"
                        render={({ field, fieldState }) => (
                            <FormControl
                                isInvalid={fieldState.invalid}
                                size="md"
                                isDisabled={field.disabled}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText>{t("form.website.label")}</FormControlLabelText>
                                </FormControlLabel>
                                <Input className="my-1">
                                    <InputField
                                        placeholder={t("form.website.placeholder")}
                                        value={field.value}
                                        onChangeText={(text) => field.onChange(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        {t("form.website.helper")}
                                    </FormControlHelperText>
                                </FormControlHelper>
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
                        control={control}
                        name="location"
                        render={({ field, fieldState }) => (
                            <FormControl
                                isInvalid={fieldState.invalid}
                                isDisabled={field.disabled}
                                isReadOnly={false}
                                isRequired={true}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText>{t("form.location.label")}</FormControlLabelText>
                                </FormControlLabel>
                                <Box className="h-56">
                                    <Maps
                                        location={userLocation ? {
                                            lat: userLocation.coords.latitude,
                                            lng: userLocation.coords.longitude
                                        } : undefined}
                                        markerIcon={MarkerIcon}
                                        selectedLocation={{
                                            lat: field.value.latitude,
                                            lng: field.value.longitude
                                        }}
                                        onSelectLocation={(location) => {
                                            field.onChange({
                                                latitude: location.lat,
                                                longitude: location.lng
                                            });
                                        }}
                                    />
                                </Box>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        {t("form.location.helper")}
                                    </FormControlHelperText>
                                </FormControlHelper>
                                <FormControlError>
                                    <FormControlErrorIcon as={AlertCircleIcon} />
                                    <FormControlErrorText>
                                        {fieldState.error?.message ? t(fieldState.error.message) : ""}
                                    </FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        )}
                    />
                </VStack>
            </Box>
            <Button onPress={handleAction}>
                <ButtonText>
                    {t("form.next")}
                </ButtonText>
            </Button>
        </>
    )
}