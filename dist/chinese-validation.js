// Keep native form validation messages in the language of this standalone site.
document.querySelectorAll('[data-demo-form] input').forEach(field=>{
  field.addEventListener('invalid',()=>{
    if(field.validity.valueMissing)field.setCustomValidity(field.type==='checkbox'?'请勾选此项以继续':'请填写此项');
    else if(field.validity.typeMismatch)field.setCustomValidity('请检查填写格式');
    else if(field.validity.patternMismatch)field.setCustomValidity('请按提示填写');
  });
  const clear=()=>field.setCustomValidity('');field.addEventListener('input',clear);field.addEventListener('change',clear);
});
