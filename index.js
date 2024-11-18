const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

// Server Side Values
const taxRate = 5; // 5%
const discountPercentage = 10; // 10%
const loyaltyRate = 2; // 2 points per $1
const dailyStandardShippingDistance = 50; //  1 day per 50 kms.
const dailyExpressShippingDistance = 100; //  1 day per 100 kms.
const shippingCostUnitFactor = 0.1;

const trueBoolean = 'TRUE';
const expressShippingMethod = 'EXPRESS';

function calculateCartTotalPrice(initialCartTotal, newItemPrice) {
  let finalCartTotal = initialCartTotal + newItemPrice;
  return finalCartTotal.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let initialCartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateCartTotalPrice(initialCartTotal, newItemPrice));
});

function calculateCartTotalBasedOnMembershipStatus(cartTotal, isMember) {
  let finalCartTotal = cartTotal;
  if (isMember.toUpperCase() === trueBoolean) {
    let discountedPrice = (discountPercentage * cartTotal) / 100;
    finalCartTotal = cartTotal - discountedPrice;
  }
  return finalCartTotal.toString();
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(calculateCartTotalBasedOnMembershipStatus(cartTotal, isMember));
});

function calculateCartTotalAfterTax(initialCartTotal) {
  let taxPrice = (initialCartTotal * taxRate) / 100;
  return taxPrice.toString();
}

app.get('/calculate-tax', (req, res) => {
  let initialCartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateCartTotalAfterTax(initialCartTotal));
});

function estimateDailyShippingDistanceByMethod(shippingMethod) {
  if (shippingMethod.toUpperCase() === expressShippingMethod) {
    return dailyExpressShippingDistance;
  }
  return dailyStandardShippingDistance;
}

function estimateDeliveryTime(shippingMethod, totalDistance) {
  let dailyDistance = estimateDailyShippingDistanceByMethod(shippingMethod);
  let deliveryTime = totalDistance / dailyDistance;
  return deliveryTime.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let totalDistance = parseFloat(req.query.distance);
  res.send(estimateDeliveryTime(shippingMethod, totalDistance));
});

function estimateShippingCost(totalWeight, totalDistance) {
  let shippingCost = totalWeight * totalDistance * shippingCostUnitFactor;
  return shippingCost.toString();
}

app.get('/shipping-cost', (req, res) => {
  let totalWeight = parseFloat(req.query.weight);
  let totalDistance = parseFloat(req.query.distance);
  res.send(estimateShippingCost(totalWeight, totalDistance));
});

function calculateLoyaltyPoints(purchaseAmount) {
  let loyaltyPoints = purchaseAmount * loyaltyRate;
  return loyaltyPoints.toString();
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
