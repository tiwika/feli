import {dynamicArraySort}from "@/../helper/utils";

Vue.component("variation-properties", {

    props: {
        template:
        {
            type: String,
            default: "#vue-variation-properties"
        },

        variationProperties:
        {
            type: Array,
            default: () => []
        },

        variationPropertyGroups:
        {
            type: Array,
            default: () => []
        }
    },

    computed:
    {
        sortedPropertyGroups()
        {
            return dynamicArraySort([...this.variationPropertyGroups], "position");
        },

        ungroupedProperties()
        {
            const ungroupedProperties = this.variationProperties.filter(property => !property.property.groups.length);

            return dynamicArraySort(ungroupedProperties, "position");
        }
    },

    created()
    {
        this.$options.template = this.template;
    },

    methods:
    {
        getPropertiesByGroupId(groupId)
        {
            const propertiesByGroup = this.variationProperties.filter(property =>
            {
                return !!property.property.groups.find(group => group.id === groupId);
            });

            return propertiesByGroup.sort((propA, propB) =>
            {
                if (propA.property.position > propB.property.position)
                {
                    return 1;
                }
                if (propA.property.position < propB.property.position)
                {
                    return -1;
                }

                return 0;
            });
        }
    }
});
