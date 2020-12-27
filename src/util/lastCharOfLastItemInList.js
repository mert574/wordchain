export default function lastCharOfLastItemInList(list) {
    const lastItem = list[list.length - 1];
    return lastItem[lastItem.length - 1];
}
