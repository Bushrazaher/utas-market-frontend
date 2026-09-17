const express = require('express');
const cors = require('cors');
const fs = require('fs'); // مكتبة للتعامل مع الملفات (موجودة افتراضياً في Node)
const productsData = require('./products.json'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // مهم جداً لقراءة البيانات المرسلة من React

// مسار جلب المنتجات (الذي عملناه سابقاً)
app.get('/api/products', (req, res) => {
  setTimeout(() => {
    res.json(productsData);
  }, 1000);
});

// مسار جديد: إضافة منتج جديد
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: Date.now(), // استخدام الوقت الحالي كـ ID فريد
    title: req.body.title,
    store: "متجري (تجريبي)", // مؤقتاً حتى نربط حسابات البائعين
    price: req.body.price + " OMR",
    category: req.body.category,
    tag: "جديد",
    bg: "bg-green-50" // لون خلفية للمنتجات المضافة حديثاً
  };

  // 1. إضافة المنتج الجديد للمصفوفة
  productsData.push(newProduct);

  // 2. حفظ المصفوفة الجديدة في ملف products.json لتبقى محفوظة
  fs.writeFileSync('./products.json', JSON.stringify(productsData, null, 2));

  // 3. إرسال رد بالنجاح لـ React
  res.status(201).json({ message: "تمت إضافة المنتج بنجاح", product: newProduct });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});