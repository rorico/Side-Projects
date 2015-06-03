using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int[] array = new int[6];
		int[,] array2 = new int[6,64];
		
		int index = 0;
		
		for ( int i = 31 ; i<32 ; i++)
		{
			int k = i;
			for ( int j = 0 ; j<6 ; j++){
				array2[j,index] = k%2;
				k = (k - k%2)/2;
				Console.WriteLine(k +" "+ array2[j,index]);
			}
			Console.WriteLine("DD");
			for ( int j = 5 ; j>=0 ; j--)
			{
		Console.WriteLine(k +" "+ array2[j,index]);			
		}

//			int sum = 0;
//			for ( int j = 0 ; j<6 ; j++){
//				sum += array2[j,index];
//			}
//			
//			Console.WriteLine(sum);
			index++;
		}		
	}
}