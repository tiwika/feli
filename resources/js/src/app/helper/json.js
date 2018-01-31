export function parseJSON(input)
{
    try
    {
        return JSON.parse(input);
    }
    catch (err)
    {
        return null;
    }
}
