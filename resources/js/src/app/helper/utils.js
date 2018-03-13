export function isNull(object)
{
    return object === null;
}

export function isUndefined(object)
{
    //eslint-disable-next-line
    return typeof object === typeof void 0;
}

export function isNullOrUndefined(object)
{
    return isNull(object) || isUndefined(object);
}

export function dynamicArraySort(array, sortingField)
{
    return array.sort((valueA, valueB) =>
    {
        if (valueA[sortingField] > valueB[sortingField])
        {
            return 1;
        }
        if (valueA[sortingField] < valueB[sortingField])
        {
            return -1;
        }

        return 0;
    });
}
