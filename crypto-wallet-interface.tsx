import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, ArrowRightLeft, Send, Copy, RefreshCcw } from 'lucide-react';

const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const generateSolanaPublicKey = () => {
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += base58Chars.charAt(Math.floor(Math.random() * base58Chars.length));
  }
  return result;
};

const CryptoWallet = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [baseAddress, setBaseAddress] = useState('');
  const [showTransactionAlert, setShowTransactionAlert] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(54.32); // Sample ETB/USD rate
  const [copySuccess, setCopySuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSignIn = () => {
    const solanaPubKey = generateSolanaPublicKey();
    setPublicKey(solanaPubKey);
    setIsSignedIn(true);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address');
    }
  };

  const handleRefreshRate = () => {
    setIsRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setExchangeRate((prev) => prev + (Math.random() - 0.5));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSend = () => {
    if (amount && baseAddress) {
      if (baseAddress.length !== 44) {
        alert('Please enter a valid Solana address');
        return;
      }
      setShowTransactionAlert(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {!isSignedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>Solana Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSignIn}
              className="w-full"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Solana Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-mono break-all flex-1">{publicKey}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyAddress}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copySuccess && (
                <p className="text-sm text-green-500 mt-1">Address copied!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate</CardTitle>
              <CardDescription>Current market rate for USD to ETB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-2xl">1 USD = {exchangeRate.toFixed(2)} ETB</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefreshRate}
                  disabled={isRefreshing}
                >
                  <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send SOL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="USD Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
                <ArrowRightLeft className="w-4 h-4" />
                <Input
                  type="number"
                  value={amount ? (parseFloat(amount) * exchangeRate).toFixed(2) : ''}
                  readOnly
                  placeholder="ETB Amount"
                  className="flex-1"
                />
              </div>
              
              <Input
                placeholder="Enter Solana Address"
                value={baseAddress}
                onChange={(e) => setBaseAddress(e.target.value)}
                className="font-mono"
              />
              
              <Button 
                onClick={handleSend}
                className="w-full"
                disabled={!amount || !baseAddress}
              >
                <Send className="mr-2 h-4 w-4" />
                Send SOL
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={showTransactionAlert} onOpenChange={setShowTransactionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transaction Successful</AlertDialogTitle>
            <AlertDialogDescription>
              {amount} USD (≈ {(parseFloat(amount) * exchangeRate).toFixed(2)} ETB) has been sent to {baseAddress}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowTransactionAlert(false);
              setAmount('');
              setBaseAddress('');
            }}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CryptoWallet;
