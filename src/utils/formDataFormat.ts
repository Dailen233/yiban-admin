export function objectToFormData(obj: Record<string, any>, form?: FormData, namespace?: string): FormData {
  const fd = form || new FormData();
  let formKey: string;

  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      const key = Array.isArray(obj) ? '[]' : `[${property}]`;

      if (namespace) {
        formKey = `${namespace}${key}`;
      } else {
        formKey = property;
      }

      // 如果属性是对象，但不是 File 对象，则递归调用 objectToFormData 处理嵌套对象
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, formKey);
      } else {
        // 如果属性值是字符串或 File 对象，直接添加到 FormData
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
}
