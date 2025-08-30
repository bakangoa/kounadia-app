

import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";


export function notifyInfo(message: string) {
    toast(message);
}

export function notifyError(message: string) {
    toast.error(message, {
        position: ToastPosition.BOTTOM,
    });
}

export function notifySuccess(message: string) {
    toast.success(message);
}