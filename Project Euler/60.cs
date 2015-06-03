using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		StreamReader sr = new StreamReader("cipher.txt");
		string[] words = sr.ReadLine().Split(',');
		int[] word = new int[words.Length];
		for ( int i = 0 ; i < words.Length ; i++ )
		{
			word[i] = int.Parse(words[i]);
			//Console.Write((char)word[i]);
		}
		int cnt = 0;
		//int min0 = 100;
		//int min1 = 100;
		//int min2 = 100;
		//int max0 = 0;
		//int max1 = 0;
		//int max2 = 0;
		
		for ( int i = 0 ; i < words.Length ; i++ )
		{
			if (cnt == 0)
			{
				word[i]^=103;
				//Console.Write((char)word[i]);
				cnt++;
				//Console.Write(i+" "+cnt+"    ");
				continue;
			}
			else if (cnt == 1)
			{
			
				word[i]^=111;
				//Console.Write((char)word[i]);
				cnt++;
				continue;
			}
			else if (cnt == 2)
			{
				word[i]^=100;
				//Console.Write((char)word[i]);
				cnt=0;
				continue;
			}
		}
		int sum = 0;
	//	Console.WriteLine("\n");
	//	Console.WriteLine((char)word[0]+"\n");
		for ( int i = 0 ; i < words.Length ; i++ )
		{
			Console.Write((char) word[i]);
			sum+=word[i];
		}
		Console.WriteLine(sum);
		
	//	for ( int i = 0 ; i < words.Length ; i++ )
	//	{
	//		if (cnt == 0)
	//		{
	//			if ( word[i]>max0)
	//			{
	//				max0=word[i];
	//			}
	//			if ( word[i]<min0)
	//			{
	//				min0=word[i];
	//			}
	//			cnt++;
	//			continue;
	//		}
	//		else if (cnt == 1)
	//		{
	//			if ( word[i]>max1)
	//			{
	//				max1=word[i];
	//			}
	//			if ( word[i]<min1)
	//			{
	//				min1=word[i];
	//			}
	//			cnt++;
	//			continue;
	//		}
	//		else if (cnt == 2)
	//		{
	//			if ( word[i]>max2)
	//			{
	//				max2=word[i];
	//			}
	//			if ( word[i]<min2)
	//			{
	//				min2=word[i];
	//			}
	//			cnt=0;
	//			continue;
	//		}
	//	}
	//	Console.WriteLine(min0+" "+max0);
	//	Console.WriteLine(min1+" "+max1);
	//	Console.WriteLine(min2+" "+max2);	

	//	char[] letter = new char[words.Length]
	//	for ( int i = 0 ; i < words.Length ; i++ )
	//	{
	//		letter[i] = new 
	}
}