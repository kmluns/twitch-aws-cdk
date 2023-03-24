

export const createUpdateParams = <T>(data:T) => {
    let updateExpression='set';
    let ExpressionAttributeNames= {};
    let ExpressionAttributeValues = {};
    for (const property in data) {
      updateExpression += ` #${property} = :${property} ,`;
      // @ts-expect-error no key
      ExpressionAttributeNames['#'+property] = property ;
      // @ts-expect-error no key
      ExpressionAttributeValues[':'+property]= data[property];
    }

    updateExpression= updateExpression.slice(0, -1);

    return {
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues
    }
}
