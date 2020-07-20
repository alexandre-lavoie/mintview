export enum Action {
    DRAG,
    DRAW
}

export function convertDataURIToBinaryFetch(dataURI: string) {
    return fetch(dataURI)
        .then((res) => res.blob());
}