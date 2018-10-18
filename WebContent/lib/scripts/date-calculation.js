//utils functions
Date.prototype.isBefore=function(compareDate){
	return this.getTime()<compareDate.getTime();
};
Date.prototype.isBeforeOrEqualTo=function(compareDate){
	return this.getTime()<=compareDate.getTime();
};
Date.prototype.isAfter=function(compareDate){
	return this.getTime()>compareDate.getTime();
};
Date.prototype.isAfterOrEqualTo=function(compareDate){
	return this.getTime()>=compareDate.getTime();
};
Date.prototype.isEqualTo=function(compareDate){
	return this.getTime()==compareDate.getTime();
};
Date.prototype.monthDifference=function(previouDate,actualDate){
	var months;
	months = (actualDate.getFullYear() - previouDate.getFullYear()) * 12;
	months += actualDate.getMonth() - previouDate.getMonth();
	return months;
};
Date.prototype.numDaysBetween=function(d)
{	
	//Set 1 day in milliseconds
	var one_day=1000*60*60*24;
	
	//Calculate difference btw the two dates, and convert to days
	return Math.ceil((this.getTime()-d.getTime())/(one_day));	
} ;
/*
 * SW custom function to accept dates in string format "yyyy-mm-dd hh:mm:ss.zzz"
 * or time in milliseconds
 */
Date.newDate=function(d)
{	
	if(d) {
		if(isNaN(d))
			return Date.parse(d);
		else
			return new Date(d);
	}
	else
		return new Date();	
};


/*
 * Returns the current time at context/selected property, 
 * gets property time zone detail from PageLoader object
 *
 * @returns a Date object - property date value
 */
Date.getDateTimeAtSelectedProperty = function() {
	var timezonecodeAndOffset = ''+PageLoader.getInstance().config().userContext.propertyTimeZoneCodeAndOffset;
	return Utilities.getInstance().adjustDateForTimezone(timezonecodeAndOffset, new Date());
};

