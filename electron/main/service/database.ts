import sql, { StoredDataType } from '../shared/sql';

type Model = StoredDataType['models'][number];

export async function saveModel(formData: Model) {
    await sql(async (data) => {
        if (!data.models) {
            data.models = [];
        }
        data.models.push(formData);
        return data;
    });
}

export async function getModels(): Promise<Model[]> {
    return await sql((data) => data.models || []);
}
