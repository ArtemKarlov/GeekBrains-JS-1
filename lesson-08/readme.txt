1) Для практикума из занятия 7 продумать, где можно применить замыкания
2) Не выполняя кода, ответить, что выведет браузер и почему:
a)
if (!("a" in window)) {
    var a = 1;
}
alert(a);

b)
var b = function a(x) {
    x && a(--x);
};
alert(a);

c)
function a(x) {
    return x * 2;
}
var a;
alert(a);

d)
function b(x, y, a) {
    arguments[2] = 10;
    alert(a);
}
b(1, 2, 3);

e)
function a() {
    alert(this);
}
a.call(null);
