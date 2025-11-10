import { Injectable } from '@nestjs/common';
import { VNPay, ProductCode, VnpLocale, dateFormat } from 'vnpay';

@Injectable()
export class PaymentService {
  private vnpay: VNPay;
  private vnp_ReturnUrl = process.env.VNPAY_RETURN_URL!;

  constructor() {
    this.vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE!,
      secureSecret: process.env.VNPAY_HASH_SECRET!,
      vnpayHost: process.env.VNPAY_URL?.replace('/paymentv2/vpcpay.html', '') || 'https://sandbox.vnpayment.vn',
      testMode: true,
    });
  }



  async createPaymentUrl(
    amount: number,
    orderId: string,
    orderInfo: string,
    ipAddr: string,
    bankCode?: string,
  ): Promise<string> {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

      const paymentData: any = {
        vnp_Amount: Math.round(amount),
      vnp_IpAddr: ipAddr,
      vnp_ReturnUrl: this.vnp_ReturnUrl.trim(),
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now),
      vnp_ExpireDate: dateFormat(tomorrow),
    };

    if (bankCode && bankCode.trim() !== '') {
      paymentData.vnp_BankCode = bankCode;
    }

    return await this.vnpay.buildPaymentUrl(paymentData);
  }

  verifyPaymentUrl(vnp_Params: Record<string, string>): boolean {
    try {
      const result = this.vnpay.verifyReturnUrl(vnp_Params as any);
      return result.isSuccess;
    } catch (error) {
      return false;
    }
  }
}

