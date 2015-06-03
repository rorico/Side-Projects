using System;

class dkafldjaf
{
	static void Main()
	{
		string s = "";
		for (int i = 0 ; i <5e5 ; i++)
		{
			string a = Convert.ToString (i);
			s+=a;
		}
		char[] b = s.ToCharArray();
		int x = (b[1]-'0')*(b[10]-'0')*(b[100]-'0')*(b[1000]-'0')*(b[10000]-'0')*(b[100000]-'0')*(b[1000000]-'0');
		Console.WriteLine(x);
	}		

}