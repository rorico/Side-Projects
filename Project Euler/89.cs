using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		StreamReader sr = new StreamReader("roman.txt");
		string text = "";
		while (!sr.EndOfStream)
		{
			text += sr.ReadLine()+" ";
		}
		sr.Close();
		text.Trim();
		string roman = "";
		int value = 0;
		int checker = 0;
		int cnt = 0;
		string[] nums = text.Split(" ".ToCharArray());
		foreach ( string num in nums )
		{
			if(num==""){
			//Console.WriteLine(cnt);
			continue;
			}
			checker = 0;
			value = 0;
			roman="";
			for ( int i = 0 ; i<num.Length ; i++)
			{
				switch(num[i])
				{
					case 'I':
					if(checker>=3){
						value++;
					}else{
						if(i!=num.Length-1)
						{
							switch(num[i+1])
							{
								case 'V':
								value--;
								break;
								case 'X':
								value--;
								break;
								default:
								value++;
								checker=3;
								break;
							}
						} else {
							value++;
						}
					}
					break;
					case 'V':
					value+=5;
					break;
					case 'X':
					if(checker>=2){
						value+=10;
					}else{
						if(i!=num.Length-1)
						{
							switch(num[i+1])
							{
								case 'L':
								value-=10;
								break;
								case 'C':
								value-=10;
								break;
								default:
								value+=10;
								checker=2;
								break;
							}
						} else {
							value+=10;
						}
					}
					break;
					case 'L':
					value+=50;
					break;
					case 'C':
					if(checker>=1){
						value+=100;
					}else{
						if(i!=num.Length-1)
						{
							switch(num[i+1])
							{
								case 'D':
								value-=100;
								break;
								case 'M':
								value-=100;
								break;
								default:
								value+=100;
								checker=1;
								break;
							}
						} else {
							value+=100;
						}
					}
					break;
					case 'D':
					value+=500;
					break;
					case 'M':
					value+=1000;
					break;
				}
			}
			if(value>=1000)
			{
				int times = (int)Char.GetNumericValue(Convert.ToString(value)[0]);
				for(int i = 0 ; i<times ; i++)
				{
					roman += 'M';
				}
				switch(value.ToString()[1])
				{
					case '9':
					roman += "CM";
					break;
					case '4':
					roman += "CD";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[1]);
					if(times2>=5)
					{
						roman += 'D';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'C';
					}
					break;
				}
				switch(value.ToString()[2])
				{
					case '9':
					roman += "XC";
					break;
					case '4':
					roman += "XL";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[2]);
					if(times2>=5)
					{
						roman += 'L';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'X';
					}
					break;
				}
				switch(value.ToString()[3])
				{
					case '9':
					roman += "IX";
					break;
					case '4':
					roman += "IV";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[3]);
					if(times2>=5)
					{
						roman += 'V';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'I';
					}
					break;
				}
			} else if(value>=100)
			{
				switch(value.ToString()[0])
				{
					case '9':
					roman += "CM";
					break;
					case '4':
					roman += "CD";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[0]);
					if(times2>=5)
					{
						roman += 'D';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'C';
					}
					break;
				}
				switch(value.ToString()[1])
				{
					case '9':
					roman += "XC";
					break;
					case '4':
					roman += "XL";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[1]);
					if(times2>=5)
					{
						roman += 'L';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'X';
					}
					break;
				}
				switch(value.ToString()[2])
				{
					case '9':
					roman += "IX";
					break;
					case '4':
					roman += "IV";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[2]);
					if(times2>=5)
					{
						roman += 'V';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'I';
					}
					break;
				}
			}else if(value>=10)
			{
				switch(value.ToString()[0])
				{
					case '9':
					roman += "XC";
					break;
					case '4':
					roman += "XL";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[0]);
					if(times2>=5)
					{
						roman += 'L';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'X';
					}
					break;
				}
				switch(value.ToString()[1])
				{
					case '9':
					roman += "IX";
					break;
					case '4':
					roman += "IV";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[1]);
					if(times2>=5)
					{
						roman += 'V';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'I';
					}
					break;
				}
			}else if(value>=1)
			{
				switch(value.ToString()[0])
				{
					case '9':
					roman += "IX";
					break;
					case '4':
					roman += "IV";
					break;
					default:
					int times2 = (int)Char.GetNumericValue(value.ToString()[0]);
					if(times2>=5)
					{
						roman += 'V';
						times2 -= 5;
					}
					for(int i = 0 ; i<times2 ; i++)
					{
						roman += 'I';
					}
					break;
				}
			}
			if(num.Length>=roman.Length)
			{
			cnt+= num.Length-roman.Length;
			Console.WriteLine(cnt + ". "+ num + " " + roman + " " + value);
			} else {
				Console.WriteLine(cnt + ". "+ num + " " + roman + " " + value);
			}
			//if(!(num==roman)){
			//	Console.WriteLine(cnt + ". "+ num + " " + roman + " " + value);
			//	cnt++;
			//}
			//if( cnt <=10)
			//{
			//Console.WriteLine(roman);
			//}
			//
			//cnt++;
		}
		Console.WriteLine(cnt);
		
	}	
}