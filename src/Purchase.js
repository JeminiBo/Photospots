import React from 'react';
import {useEffect, useCallback, useState} from 'react';
import {useIAP, IapIos} from 'react-native-iap';
import {Platform, Button, StyleSheet, Text, View} from 'react-native';

const Purchase = () => {
  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    purchaseHistories,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistories,
    requestPurchase,
    requestSubscription,
  } = useIAP();

  const handlePurchase = async sku => {
    if (connected) {
      const purchase = await requestPurchase(
        Platform.select({
          ios: {sku},
          android: {skus: [sku]},
        }),
      );
      console.log('PURCHASE', purchase);
    }
  };

  const handleSubscription = async (sku, offerToken) => {
    if (connected) {
      if (Platform.OS === 'ios') {
        await IapIos.clearTransactionIOS();
        await requestSubscription({sku});
      } else {
        await requestSubscription({
          subscriptionOffers: [{sku, offerToken}],
        });
      }
    }
  };

  const getActiveSubscriptions = async () => {
    try {
      const currentAvailablePurchases = await getAvailablePurchases();
      // Filter active subscriptions
      const activeSubscriptions = currentAvailablePurchases.filter(purchase => {
        // Check if the subscription is active, based on your specific use case
        return (
          purchase.productId === 'your_subscription_product_id' &&
          purchase.transactionReceipt
        );
      });
      console.log('Active subscriptions:', activeSubscriptions);
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  };

  useEffect(() => {
    // ... listen to currentPurchaseError, to check if any error happened
    console.log('CURRENT PURCHASE ERROR', currentPurchaseError);
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      async () => {
        console.log('CURRENT PURCHASE', currentPurchase);
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
      };
    }
  }, [currentPurchase, finishTransaction]);

  console.log('PRODUCTS', products);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Get the products"
        onPress={() => {
          getProducts({skus: ['123jl13lk13']});
          getSubscriptions({skus: ['123jksdsa123']});
        }}
      />

      {products.map(product => (
        <View key={product.productId}>
          <Text>{product.productId}</Text>

          <Button
            title="Buy"
            onPress={() => handlePurchase(product.productId)}
          />
        </View>
      ))}

      {subscriptions.map(subscription => (
        <View key={subscription.productId}>
          <Text>{subscription.productId}</Text>

          <Button
            title="Buy"
            onPress={() =>
              handleSubscription(
                subscription.productId,
                subscription.subscriptionOfferDetails[0].offerToken,
              )
            }
          />
        </View>
      ))}
    </View>
  );
};

export {Purchase};
