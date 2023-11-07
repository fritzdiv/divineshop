import { AppUpdate, AppUpdateAvailability } from '@robingenz/capacitor-app-update';

export function useAppUpdate() {
    const getCurrentAppVersion = async () => {
        const result = await AppUpdate.getAppUpdateInfo();
        return result.currentVersion;
    };


    const getAvailableAppVersion = async () => {
        const result = await AppUpdate.getAppUpdateInfo();
        return result.availableVersion;
    };


    const performImmediateUpdate = async () => {
        const result = await AppUpdate.getAppUpdateInfo();
        if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
            return;
        }
        if (result.immediateUpdateAllowed) {
            await AppUpdate.performImmediateUpdate();
        }
    };

    const openAppStore = async () => {
        await AppUpdate.openAppStore();
    };

    const startFlexibleUpdate = async () => {
        const result = await AppUpdate.getAppUpdateInfo();
        if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
            return;
        }
        if (result.flexibleUpdateAllowed) {
            await AppUpdate.startFlexibleUpdate();
        }
    };

    const completeFlexibleUpdate = async () => {
        await AppUpdate.completeFlexibleUpdate();
    };

    const hasUpdatedVersion = async () => {
        const installedVersion = await getCurrentAppVersion();
        const updatedVersion = await getAvailableAppVersion();

        if(updatedVersion > installedVersion) {
            return true
        }

        return false;
    }

    const updateNow = async () => {
        const hasNewVersion = await hasUpdatedVersion();

        if(hasNewVersion) {
            await performImmediateUpdate()
        }
    }

    return  {
        getCurrentAppVersion,
        getAvailableAppVersion,
        performImmediateUpdate,
        updateNow,
        openAppStore,
        completeFlexibleUpdate,
        startFlexibleUpdate,
        hasUpdatedVersion
    }
}
