async function convertMinutesToString(inputMinutes){
    if(inputMinutes < 60){ return 'less than 60 minutes' }

    const months = Math.floor(inputMinutes / 43200)
    const days = Math.floor(inputMinutes / 1440)
    const daysLeftInMonth = Math.floor((inputMinutes % 43200) / 1440)
    const hours = Math.floor((inputMinutes % 1440) / 60)

    //NOTE: time formatting here isn't handled beyond 12 months
    //FIXME: for some reason, after six months, it'll start to lose time by half a day after each month
    //i think its because of february messing up the modulus (%) calculation
    let resultTime = ''
    if(months > 0){ 
      resultTime += `${months} month${months > 1 ? 's': ''}`
      if(days > 30 && daysLeftInMonth > 0){ resultTime += ` and ${daysLeftInMonth} day${daysLeftInMonth > 1 ? 's' : ''}` }
    }
    if(!months && days > 0){
      if(resultTime){ resultTime += ', ' }
      resultTime += `${days} day${days > 1 ? 's' : ''}`
    }
    if(!days && hours > 0){
      if(resultTime){ resultTime += ', ' }
      resultTime += `${hours} hour${hours > 1 ? 's' : ''}`
    }

    return resultTime
}


export async function getTimeRemainingString(targetIsoString){
    const target = new Date(targetIsoString)
    const now = new Date()
    const diffMs = target - now
    
    if(diffMs <= 0){ return null }
    
    const minutesRemaining = Math.floor(diffMs / 1000 / 60)
    return (await convertMinutesToString(minutesRemaining))
  }