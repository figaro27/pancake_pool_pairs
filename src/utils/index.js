
export const sortAddress = (add) => {
    const sortAdd = `${add.slice(0, 6)}...${add.slice(add.length - 4)}`
    return sortAdd;
}