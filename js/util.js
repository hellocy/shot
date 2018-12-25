export default {
    // 快速排序
    quickSort: (arr) => {
        if (arr.length <= 1) {return arr;}
        let pivotIndex = Math.floor(arr.length / 2);
        let pivot = arr.splice(pivotIndex, 1)[0];
        let pivotRect = pivot.el.getBoundingClientRect();
        let left = [];
        let right = [];
        for (let i = 0; i < arr.length; i++) {
            let recti = arr[i].el.getBoundingClientRect();
            if(recti.x <= pivotRect.x){
                left.push(arr[i]);
            }
            else{
                right.push(arr[i]);
            }
        }
        return quickSort(left).concat([pivot], quickSort(right));
    },

    randomFrom: (lowerValue,upperValue) => {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    },

    hasClass: (ele, cls) => {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
    },

    addClass: (ele, cls) => {
        if (!hasClass(ele, cls)) {
            ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
        }
    },

    removeClass: (ele, cls) => {
        if (hasClass(ele, cls)) {
            var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            ele.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }
}
