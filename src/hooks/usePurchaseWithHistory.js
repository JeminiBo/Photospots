import { useEffect, useState } from 'react';
import { useIAP, IapIos } from 'react-native-iap';
import { Platform } from 'react-native';

export const usePurchaseWithHistory = () => {
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
    getPurchaseHistory,
    requestPurchase,
    requestSubscription,
  } = useIAP();
  const [isUserHaveSubscription, setIsUserHaveSubscription] = useState(false);
  const [isSubscriptionsLoaded, setIsSubscriptionsLoaded] = useState(false);

  const handlePurchase = async (sku) => {
    if (connected) {
      await requestPurchase(
        Platform.select({
          ios: { sku },
          android: { skus: [sku] },
        }),
      );
    }
  };

  const handleSubscription = async (sku, offerToken) => {
    if (connected) {
      if (Platform.OS === 'ios') {
        await IapIos.clearTransactionIOS();
        await requestSubscription({ sku });
      } else {
        await requestSubscription({
          subscriptionOffers: [{ sku, offerToken }],
        });
      }
    }
  };

  useEffect(() => {
    // ... listen to currentPurchaseError, to check if any error happened
    console.log('CURRENT PURCHASE ERROR', currentPurchaseError);
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      async () => {
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
      };
    }
  }, [currentPurchase, finishTransaction]);

  useEffect(() => {
    if (connected && subscriptions.length) {
      getAvailablePurchases().finally(() => {
        setIsSubscriptionsLoaded(true);
      });
    }
  }, [connected, subscriptions, getAvailablePurchases]);

  useEffect(() => {
    if (availablePurchases.length) {
      try {
        // Filter active subscriptions
        const activeSubscriptions = availablePurchases.filter((purchase) => {
          // Check if the subscription is active, based on your specific use case
          return (purchase.productId === Platform.OS) === 'ios'
            ? 'fasfas4324asaf'
            : '123jl13lk13' && purchase.transactionReceipt;
        });
        setIsUserHaveSubscription(!!activeSubscriptions.length);
        console.log('Active subscriptions:', activeSubscriptions);
      } catch (err) {
        console.warn(err); // standardized err.code and err.message available
      }
    }
  }, [availablePurchases]);

  useEffect(() => {
    getProducts({
      skus: Platform.OS === 'ios' ? ['fasfas4324asaf'] : ['123jl13lk13'],
    });
    getSubscriptions({
      skus: Platform.OS === 'ios' ? ['asdsad32432fsaf'] : ['123jksdsa123'],
    });
  }, [getProducts, getSubscriptions]);

  return {
    products,
    subscriptions,
    handlePurchase,
    handleSubscription,
    isUserHaveSubscription,
    isSubscriptionsLoaded,
  };
};
