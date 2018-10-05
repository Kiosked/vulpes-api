function mapSmartQueryParameters(query) {
    return Object.keys(query).reduce((newQuery, nextKey) => {
        let nextValue = query[nextKey];
        if (typeof nextValue === "object" && nextValue !== null) {
            if (nextValue.type === "regex" && typeof nextValue.value === "string") {
                nextValue = new RegExp(nextValue.value, nextValue.modifier || "");
            }
        }
        return Object.assign(newQuery, {
            [nextKey]: nextValue
        });
    }, {});
}

module.exports = {
    mapSmartQueryParameters
};
