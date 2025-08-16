import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";
import { z } from "zod";
import { Shift } from "../../domain/mosque";

export const mosqueOpeningHourSchema = z.object({
    shifts: z.array(z.object({
        dayOfWeek: z.number(),
        openTime: z.string(),
        closeTime: z.string()
    })).min(1, "form.shifts.error.min")
});

const days = ["form.monday", "form.tuesday", "form.wednesday", "form.thursday", "form.friday", "form.saturday", "form.sunday"]

interface Props {
    onNext: () => void
}

export function MosqueOpeningHourForm(props: Props) {
    const { t } = useTranslation("add");
    const [shifts, setShifts] = useState<{
        [dayOfWeek: number]: Shift[]
    }>([]);

    const [openedTimePickerIndex, setOpenedTimePickerIndex] = useState<{
        dayOfWeek: number,
        index: number,
        isStart: boolean
    } | null>(null);

    const { setValue, trigger, getFieldState, setError } = useFormContext();

    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

    function handleDayChecked(dayIndex: number, isSelected: boolean) {
        setShifts((prevShifts) => {
            const localShifts = { ...prevShifts };
            if (!isSelected) {
                delete localShifts[dayIndex];
                return localShifts
            }

            localShifts[dayIndex] = [
                {
                    dayOfWeek: dayIndex,
                    openTime: "00:00",
                    closeTime: "00:00"
                }
            ];
            return localShifts
        })
    }

    function handleAddShift(dayIndex: number) {
        setShifts((prevShifts) => {
            const localShifts = { ...prevShifts };
            if (!localShifts[dayIndex]) {
                localShifts[dayIndex] = [];
            }
            localShifts[dayIndex].push({
                dayOfWeek: dayIndex,
                openTime: "00:00",
                closeTime: "00:00"
            });
            return localShifts
        })
    }

    function handleUpdateShift(dayIndex: number, shiftIndex: number, shift: Shift) {
        setShifts((prevShifts) => {
            const localShifts = { ...prevShifts };
            localShifts[dayIndex][shiftIndex] = shift;
            return localShifts
        })
    }

    function handleRemoveShift(dayIndex: number, shiftIndex: number) {
        setShifts((prevShifts) => {
            const localShifts = { ...prevShifts };
            localShifts[dayIndex].splice(shiftIndex, 1);
            return localShifts
        })
    }

    function handleOpenTimePicker(dayIndex: number, shiftIndex: number, isStart: boolean) {
        setOpenedTimePickerIndex({
            dayOfWeek: dayIndex,
            index: shiftIndex,
            isStart
        })
    }

    function handleSetTime(params: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }) {
        if (openedTimePickerIndex) {
            const timeParts = [];

            if (params.hours !== undefined) {
                timeParts.push(params.hours.toString().padStart(2, "0"));
            }
            if (params.minutes !== undefined) {
                timeParts.push(params.minutes.toString().padStart(2, "0"));
            }

            const time = timeParts.join(":");
            handleUpdateShift(openedTimePickerIndex.dayOfWeek, openedTimePickerIndex.index, {
                ...shifts[openedTimePickerIndex.dayOfWeek][openedTimePickerIndex.index],
                [openedTimePickerIndex.isStart ? "openTime" : "closeTime"]: time
            })
        }
    }

    async function handleAction() {
        setHasBeenSubmitted(true);
        if (Object.values(shifts).length === 0) {
            setError("shifts", { message: "form.shifts.error.min" });
            return;
        }

        setValue("shifts", Object.values(shifts).flat());
        const valid = await trigger(["shifts"]);

        if (!valid) {
            return;
        }
        props.onNext();
    }

    return (
        <>
            <Box className="pt-4 flex-1">
                <VStack className="gap-4">
                    {
                        days.map((day, index) => {
                            return (
                                <>
                                    <HStack key={index} className="justify-between">
                                        <Checkbox
                                            size="md"
                                            value={day}
                                            isChecked={shifts[index] !== undefined}
                                            onChange={(isSelected) => handleDayChecked(index, isSelected)} >
                                            <CheckboxIndicator>
                                                <CheckboxIcon as={CheckIcon} />
                                            </CheckboxIndicator>
                                            <CheckboxLabel>{t(day)}</CheckboxLabel>
                                        </Checkbox>
                                        <VStack>
                                            {
                                                shifts[index] !== undefined && (
                                                    shifts[index].map((shift, i) => {
                                                        return (
                                                            <HStack key={i} className="items-center gap-4">
                                                                <Pressable onPress={() => handleOpenTimePicker(index, i, true)}>
                                                                    <Text>
                                                                        {shift.openTime}
                                                                    </Text>
                                                                </Pressable>
                                                                <Pressable onPress={() => handleOpenTimePicker(index, i, false)}>
                                                                    <Text>
                                                                        {shift.closeTime}
                                                                    </Text>
                                                                </Pressable>
                                                                {
                                                                    i !== 0 && (
                                                                        <Pressable onPress={() => handleRemoveShift(index, i)}>
                                                                            <Icon as={CloseIcon} />
                                                                        </Pressable>
                                                                    )
                                                                }
                                                            </HStack>
                                                        )
                                                    })
                                                )
                                            }
                                        </VStack>
                                        <Pressable onPress={() => handleAddShift(index)}>
                                            <Icon as={AddIcon} />
                                        </Pressable>
                                    </HStack>
                                    {
                                        index !== days.length - 1 && (
                                            <Divider />
                                        )
                                    }
                                </>
                            )
                        })
                    }
                    {
                        (getFieldState("shifts").error && hasBeenSubmitted) && (
                            <Text className="text-red-500">
                                {getFieldState("shifts").error?.message ? t(getFieldState("shifts").error!.message!) : ""}
                            </Text>
                        )
                    }
                </VStack>
                <TimerPickerModal
                    visible={openedTimePickerIndex !== null}
                    setIsVisible={(isVisible) => setOpenedTimePickerIndex(isVisible ? openedTimePickerIndex : null)}
                    hideSeconds
                    padHoursWithZero
                    initialValue={openedTimePickerIndex ? {
                        hours: Number(shifts[openedTimePickerIndex!.dayOfWeek][openedTimePickerIndex!.index][openedTimePickerIndex!.isStart ? "openTime" : "closeTime"].split(':')[0]),
                        minutes: Number(shifts[openedTimePickerIndex!.dayOfWeek][openedTimePickerIndex!.index][openedTimePickerIndex!.isStart ? "openTime" : "closeTime"].split(':')[1]),
                    } : undefined}
                    onConfirm={(pickedDuration) => {
                        handleSetTime(pickedDuration)
                        setOpenedTimePickerIndex(null)
                    }}
                    onCancel={() => setOpenedTimePickerIndex(null)}
                    closeOnOverlayPress
                    modalProps={{
                        overlayOpacity: 0.2,
                    }}
                />
            </Box>
            <Button onPress={handleAction}>
                <ButtonText>
                    {t("form.next")}
                </ButtonText>
            </Button>
        </>
    )
}