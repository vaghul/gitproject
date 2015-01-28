import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;

 class flipping {



    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in =new Scanner(System.in);
        int n,i;
        long num;
        n=in.nextInt();
        long result[] =new long[n];
        for(i=0;i<n;i++)
            {
            num=in.nextLong();
            byte[] bits = toBinary(num);
            result[i]=printBinary(bits);
            }
        for(i=0;i<n;i++)
            System.out.println(result[i]);
}
     public static long printBinary(byte[] binary) {
         double a=0;
        for (int i = binary.length - 1; i >= 0; i--) {
        if(binary[i]==1)
            a=a+0;
        else 
            a=a+Math.pow(2,i);
        }
         return Math.round(a);
    }
    
     public static byte[] toBinary(long number) {
        byte[] binary = new byte[32];
        int index = 0;
        long temp = number;
        while (temp > 0) {
            binary[index++] = (byte) (temp % 2);
            temp = temp / 2;
        }
 
        return binary;
    }
    
    
    
}