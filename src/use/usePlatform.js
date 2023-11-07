export function usePlatform() {

    const isiOS = () => {
        return this.$q.platform.is.ios;
    }

    return {
        isiOS
    };
}
