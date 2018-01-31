Vue.filter("itemName", function(item, selectedName)
{
    selectedName = parseInt(selectedName);

    if (selectedName === 0 && item.name1.length > 0)
    {
        return item.name1;
    }
    else if (selectedName === 1 && item.name2.length > 0)
    {
        return item.name2;
    }
    else if (selectedName === 2 && item.name3.length > 0)
    {
        return item.name3;
    }

    return item.name1;
});
